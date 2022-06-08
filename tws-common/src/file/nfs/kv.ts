// Side note(teawithsand): Yes, it was easier to implement Write-Ahead logging than use IDB transactions
import { FileSystemDirectoryHandle, FileSystemFileHandle, FileSystemPermissionRequest, FileSystemPermissionResult, FileSystemWritableFileStream, FileSystemWritableFileStreamCommand, FileSystemWritableOptions, FileSystemEntryName as FileSystemName } from "tws-common/file/nfs";
import { EntryNotFoundNativeFileSystemError, InvalidEntryTypeNativeFileSystemError } from "tws-common/file/nfs/error";
import KeyValueStore from "tws-common/keyvalue/KeyValueStore";
import { collectAsyncIterable } from "tws-common/lang/asyncIterator";
import { generateUUID } from "tws-common/lang/uuid";


type Key = string & { readonly ty: unique symbol }

const ROOT_ENTRY_ID = "00000000-0000-0000-0000-000000000000" as Key

enum EntryType {
	FILE = 1,
	DIR = 2,
}

type Value =
	| {
			type: EntryType.FILE
			file: File
	  }
	| {
			type: EntryType.DIR
			children: {
				[name: FileSystemName]: Key // map of filename to it's id. Useful when looking up children
			}
	  }

enum WriteAheadOPType {
	REMOVE = 1,
}

type WriteAheadOP = {
	type: WriteAheadOPType.REMOVE
	root: Key
}

type Store = {
	entries: KeyValueStore<Value, Key>
	wal: KeyValueStore<WriteAheadOP, string>
}

const executeWalOp = async (store: Store, op: WriteAheadOP) => {
	if (op.type === WriteAheadOPType.REMOVE) {
		const entry = await store.entries.get(op.root)
		if (!entry) return // already removed, we are done
		if (entry.type === EntryType.FILE) {
			await store.entries.delete(op.root)
		} else if (entry.type === EntryType.DIR) {
			for (const child of Object.values(entry.children)) {
				// This is hack
				// but it works
				// so just use it.
				await executeWalOp(store, {
					root: child,
					type: WriteAheadOPType.REMOVE,
				})
				await store.entries.delete(op.root)
			}
		}
	}
}

class Writer implements FileSystemWritableFileStream {
	private position = 0
	constructor(
		private readonly store: Store,
		private readonly id: Key,
		private size: number,
		private file: File,
	) {}

	seek = async (position: number): Promise<void> => {
		await this.write({
			type: "seek",
			position,
		})
	}

	truncate = async (size: number): Promise<void> => {
		await this.write({
			type: "truncate",
			size,
		})
	}

	write = async (chunk: FileSystemWritableFileStreamCommand) => {
		if (typeof chunk === "object") {
			if (chunk.type === "write") {
				if (Number.isInteger(chunk.position) && chunk.position >= 0) {
					if (this.size < chunk.position) {
						this.file = new File(
							[
								this.file,
								new ArrayBuffer(chunk.position - this.size),
							],
							this.file.name,
							this.file,
						)
					}
					this.position = chunk.position
				}
			} else if (chunk.type === "seek") {
				if (Number.isInteger(chunk.position) && chunk.position >= 0) {
					if (this.size < chunk.position) {
						throw new DOMException("invalid seek")
					}
					this.position = chunk.position
					return
				} else {
					throw new DOMException(
						`invalid seek argument: got ${chunk.position} expected integer >= 0`,
					)
				}
			} else if (chunk.type === "truncate") {
				if (Number.isInteger(chunk.size) && chunk.size >= 0) {
					let file = this.file
					file =
						chunk.size < this.size
							? new File(
									[file.slice(0, chunk.size)],
									file.name,
									file,
							  )
							: new File(
									[
										file,
										new Uint8Array(chunk.size - this.size),
									],
									file.name,
									file,
							  )

					this.size = file.size
					if (this.position > file.size) {
						this.position = file.size
					}
					this.file = file
					return
				} else {
					throw new DOMException("truncate requires a size argument")
				}
			}
		}

		const chunkBlob = new Blob([chunk.data])

		const head = this.file.slice(0, this.position)
		const tail = this.file.slice(this.position + chunkBlob.size)

		let padding = this.position - head.size
		if (padding < 0) {
			padding = 0
		}
		const newFile = new File(
			[head, new Uint8Array(padding), chunkBlob, tail],
			this.file.name,
		)
		this.size = newFile.size
		this.position += chunkBlob.size
		this.file = newFile
	}

	close = async (): Promise<void> => {
		const file = await this.store.entries.get(this.id)
		if (!file) {
			throw new EntryNotFoundNativeFileSystemError()
		}
		await this.store.entries.set(this.id, {
			type: EntryType.FILE,
			file: this.file,
		})
	}
}

export class KeyValueFileHandle implements FileSystemFileHandle {
	constructor(
		private readonly store: Store,
		private readonly id: Key,
		public readonly name: FileSystemName,
	) {}
	queryPermission = async (
		opts: FileSystemPermissionRequest,
	): Promise<FileSystemPermissionResult> => {
		return "granted"
	}
	requestPermission = async (
		opts: FileSystemPermissionRequest,
	): Promise<FileSystemPermissionResult> => {
		return "granted"
	}
	public readonly kind = "file"

	isSameEntry = async (other: FileSystemHandle): Promise<boolean> => {
		return other instanceof KeyValueFileHandle && other.id === this.id
	}

	getFile = async (): Promise<File> => {
		const file = await this.store.entries.get(this.id)
		if (!file) throw new EntryNotFoundNativeFileSystemError()
		if (file.type !== EntryType.FILE)
			throw new InvalidEntryTypeNativeFileSystemError()
		return file.file
	}

	createWritable = async (
		opts?: FileSystemWritableOptions,
	): Promise<FileSystemWritableFileStream> => {
		let file: File
		if (opts?.keepExistingData) {
			file = await this.getFile()
		} else {
			// TODO(teawithsand): replace this with has key check as soon as it's implemented in store
			await this.getFile()
			file = new File([], this.name)
		}

		return new Writer(this.store, this.id, file.size, file)
	}
}

export class KeyValueDirectoryHandle implements FileSystemDirectoryHandle {
	public readonly kind = "directory"

	constructor(
		private readonly store: Store,
		private readonly id: Key,
		public readonly name: string,
	) {}

	queryPermission = async (
		opts: FileSystemPermissionRequest,
	): Promise<FileSystemPermissionResult> => {
		return "granted"
	}
	
	requestPermission = async (
		opts: FileSystemPermissionRequest,
	): Promise<FileSystemPermissionResult> => {
		return "granted"
	}

	async *entries() {
		const file = await this.store.entries.get(this.id)

		if (!file) throw new EntryNotFoundNativeFileSystemError()
		for (const [name, [id, isFile]] of Object.entries(file) as any) {
			yield [
				name,
				isFile
					? new KeyValueFileHandle(this.store, id, name)
					: new KeyValueDirectoryHandle(this.store, id, name),
			]
		}
	}

	async *keys() {
		const file = await this.store.entries.get(this.id)

		if (!file) throw new EntryNotFoundNativeFileSystemError()
		for (const [name, [id, isFile]] of Object.entries(file) as any) {
			yield name
		}
	}

	async *values() {
		const file = await this.store.entries.get(this.id)

		if (!file) throw new EntryNotFoundNativeFileSystemError()
		for (const [name, [id, isFile]] of Object.entries(file) as any) {
			yield isFile
				? new KeyValueFileHandle(this.store, id, name)
				: new KeyValueDirectoryHandle(this.store, id, name)
		}
	}

	[Symbol.asyncIterator] = this.entries

	getDirectoryHandle = async (
		name: FileSystemName,
		options?: FileSystemGetDirectoryOptions | undefined,
	): Promise<FileSystemDirectoryHandle> => {
		const file = await this.store.entries.get(this.id)

		if (!file) {
			throw new EntryNotFoundNativeFileSystemError(
				`Parent dir was removed when tried to get ${name} directory handle`,
			)
		}
		if (file.type !== EntryType.DIR) {
			throw new InvalidEntryTypeNativeFileSystemError(
				"Expected dir, got file",
			)
		}
		const entryId = file.children[name] ?? null

		if (!entryId) {
			if (options?.create) {
				const id = generateUUID() as Key
				await this.store.entries.set(id, {
					type: EntryType.DIR,
					children: {},
				})

				return new KeyValueDirectoryHandle(this.store, id, name)
			}
			throw new EntryNotFoundNativeFileSystemError()
		}

		return new KeyValueDirectoryHandle(this.store, entryId, name)
	}

	removeEntry = async (
		name: FileSystemName,
		options?: FileSystemRemoveOptions | undefined,
	): Promise<void> => {
		// Since we have no transactions
		// We implement them using write-ahead logging
		// 1. We create WAL op
		// 2. Remove entries from lowest-level to highest level(post-order) so we always can access lowest-level children
		// 3. Delete WAL op, so it does not has to be repeated

		const file = await this.store.entries.get(this.id)
		if (!file) {
			throw new EntryNotFoundNativeFileSystemError(
				`Parent dir was already removed when tried to remove ${name} child`,
			)
		}
		if (file.type !== EntryType.DIR) {
			throw new InvalidEntryTypeNativeFileSystemError(
				"Expected dir, got file",
			)
		}

		const childId = file.children[name] ?? null
		if (childId === null)
			throw new EntryNotFoundNativeFileSystemError(
				`Entry with name ${name} was not found in parent for remove`,
			)

		const op: WriteAheadOP = {
			type: WriteAheadOPType.REMOVE,
			root: childId,
		}

		// Note: wall op is not required, if entry is file, but we can't know that just yet, we have to query file
		// So just leave this as-is

		const walOpId = generateUUID()
		await this.store.wal.set(walOpId, op)
		await executeWalOp(this.store, op)
		await this.store.wal.delete(walOpId)
	}

	resolve = (
		possibleDescendant: FileSystemHandle,
	): Promise<string[] | null> => {
		// I won't use it anyway
		throw new Error("NIY")
	}

	isSameEntry = async (other: FileSystemHandle): Promise<boolean> => {
		return other instanceof KeyValueDirectoryHandle && other.id === this.id
	}

	getFileHandle = async (
		name: FileSystemName,
		options?: FileSystemGetFileOptions,
	): Promise<FileSystemFileHandle> => {
		const file = await this.store.entries.get(this.id)
		if (!file) {
			throw new EntryNotFoundNativeFileSystemError(
				`Parent dir was already removed when tried to remove ${name} child`,
			)
		}
		if (file.type !== EntryType.DIR) {
			throw new InvalidEntryTypeNativeFileSystemError(
				"Expected dir, got file",
			)
		}

		let childId = file.children[name] ?? null
		if (!childId) {
			if (options?.create) {
				childId = generateUUID() as Key
				file.children[name] = childId
				await this.store.entries.set(this.id, file)
			} else {
				throw new EntryNotFoundNativeFileSystemError(
					"File to open was not found",
				)
			}
		}

		// File creation may have been done only partially, so finish it
		if (!(await this.store.entries.get(childId))) {
			await this.store.entries.set(childId, {
				type: EntryType.FILE,
				file: new File([], name),
			})
		}

		return new KeyValueFileHandle(this.store, childId, name)
	}
}

// Note: there should be no more than one FS with same name
// TODO(teawithsand): use web locks to provide inter-tab locking for file ops
export const getKeyValueNativeFileSystem = async (
	store: Store,
): Promise<FileSystemDirectoryHandle> => {
	// Root entry must exist.
	// It can't be deleted, and if it was
	// it means that whole FS was deleted, so
	// performing clearing here is ok
	const root = await store.entries.get(ROOT_ENTRY_ID)
	if (!root || root.type !== EntryType.DIR) {
		await store.entries.clear()
		await store.wal.clear()
		await store.entries.set(ROOT_ENTRY_ID, {
			type: EntryType.DIR,
			children: {},
		})
	}
	const realRoot = await store.entries.get(ROOT_ENTRY_ID)
	if (!realRoot || realRoot.type !== EntryType.DIR)
		throw new Error("Unreachable code")

	const walOps = await collectAsyncIterable(store.wal.iterateKeys())

	for (const walOp of walOps) {
		const op = await store.wal.get(walOp)
		if (!op) continue

		await executeWalOp(store, op)
	}

	return new KeyValueDirectoryHandle(store, ROOT_ENTRY_ID, "")
}