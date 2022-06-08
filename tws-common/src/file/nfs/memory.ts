// Side note(teawithsand): It's separate from keyvalue with in-memory store, since it does not need features like WAL logging and in general it's much simpler
// Having second implementation for testing is nice
import {
	FileSystemDirectoryHandle,
	FileSystemEntryName,
	FileSystemFileHandle,
	FileSystemPermissionRequest,
	FileSystemPermissionResult,
	FileSystemWritableFileStream,
	FileSystemWritableFileStreamCommand,
	FileSystemWritableOptions,
} from "tws-common/file/nfs"
import {
	EntryNotFoundNativeFileSystemError,
	InvalidArgumentNativeFileSystemError,
	InvalidEntryTypeNativeFileSystemError,
} from "tws-common/file/nfs/error"
import { isEntryNameValid } from "tws-common/file/nfs/path"
import { makeAsyncIterable } from "tws-common/lang/asyncIterable"

// TODO(teawithsand): unify this among all implementations of streams
class Writer implements FileSystemWritableFileStream {
	private position = 0
	constructor(
		private readonly setFile: (file: File | null) => void,
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
		this.setFile(this.file)
	}
}

export class InMemoryFileHandle implements FileSystemFileHandle {
	public readonly kind = "file"
	constructor(
		private file: File | null, // null when deleted
		public readonly name: FileSystemEntryName, // name's required, since file may have been set to null
	) {
		if (file !== null && file.name !== name)
			throw new Error("Names mismatch between file and given one")
	}

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

	isSameEntry = async (other: FileSystemHandle): Promise<boolean> => {
		return this === other
	}

	getFile = async (): Promise<File> => {
		if (!this.file)
			throw new EntryNotFoundNativeFileSystemError(
				"Parent file was removed",
			)
		return this.file
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

		return new Writer(
			newFile => {
				this.file = newFile
			},
			file.size,
			file,
		)
	}

	/**
	 * @private
	 */
	_destroy = () => {
		this.file = null
	}
}

export class InMemoryDirectoryHandle implements FileSystemDirectoryHandle {
	public readonly kind = "directory"

	constructor(
		public readonly name: string,
		private dataEntries: Map<
			FileSystemEntryName,
			InMemoryFileHandle | InMemoryDirectoryHandle
		> | null = new Map(),
	) {}

	getMutableRawEntries = () => this.dataEntries

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

	entries = () => {
		if (!this.dataEntries) throw new EntryNotFoundNativeFileSystemError()
		return makeAsyncIterable(
			this.dataEntries.entries() as Iterable<
				[FileSystemEntryName, FileSystemEntry]
			>,
		)
	}
	keys = () => {
		if (!this.dataEntries) throw new EntryNotFoundNativeFileSystemError()
		return makeAsyncIterable(this.dataEntries.keys())
	}
	values = () => {
		if (!this.dataEntries) throw new EntryNotFoundNativeFileSystemError()
		return makeAsyncIterable(
			this.dataEntries.values() as Iterable<FileSystemEntry>,
		)
	};
	[Symbol.asyncIterator] = this.entries

	getDirectoryHandle = async (
		name: FileSystemEntryName,
		options?: FileSystemGetDirectoryOptions | undefined,
	): Promise<FileSystemDirectoryHandle> => {
		if (!this.dataEntries) throw new EntryNotFoundNativeFileSystemError()

		let childEntry = this.dataEntries.get(name)

		if (!childEntry) {
			if (options?.create) {
				if (!isEntryNameValid(name))
					throw new InvalidArgumentNativeFileSystemError(
						`Name ${name} is not valid file name`,
					)

				childEntry = new InMemoryDirectoryHandle(name)
				this.dataEntries.set(name, childEntry)
			} else {
				throw new EntryNotFoundNativeFileSystemError()
			}
		}

		if (childEntry?.kind !== "directory")
			throw new InvalidEntryTypeNativeFileSystemError()

		return childEntry
	}

	removeEntry = async (
		name: FileSystemEntryName,
		options?: FileSystemRemoveOptions | undefined,
	): Promise<void> => {
		if (!this.dataEntries) throw new EntryNotFoundNativeFileSystemError()

		const childEntry = this.dataEntries.get(name)

		if (!childEntry) {
			throw new EntryNotFoundNativeFileSystemError()
		}

		childEntry._destroy()

		this.dataEntries.delete(name)
	}

	resolve = (
		possibleDescendant: FileSystemHandle,
	): Promise<string[] | null> => {
		// I won't use it anyway
		throw new Error("NIY")
	}

	isSameEntry = async (other: FileSystemHandle): Promise<boolean> => {
		return other === this
	}

	getFileHandle = async (
		name: FileSystemEntryName,
		options?: FileSystemGetFileOptions,
	): Promise<FileSystemFileHandle> => {
		if (!this.dataEntries) throw new EntryNotFoundNativeFileSystemError()

		let childEntry = this.dataEntries.get(name)

		if (!childEntry) {
			if (options?.create) {
				if (!isEntryNameValid(name))
					throw new InvalidArgumentNativeFileSystemError(
						`Name ${name} is not valid file name`,
					)
				childEntry = new InMemoryFileHandle(new File([], name), name)
				this.dataEntries.set(name, childEntry)
			} else {
				throw new EntryNotFoundNativeFileSystemError()
			}
		}

		if (childEntry?.kind !== "file")
			throw new InvalidEntryTypeNativeFileSystemError()

		return childEntry
	}

	/**
	 * @private
	 */
	_destroy = () => {
		if (!this.dataEntries) return
		for (const key of this.dataEntries.keys()) {
			try {
				this.removeEntry(key)
			} catch (e) {
				// ignore exceptions in destroy procedure
			}
		}
		this.dataEntries = null
	}

	/**
	 * @private
	 */
	static readonly makeRoot = (rootName: string) =>
		new InMemoryDirectoryHandle(rootName)
}

export const createInMemoryFileSystem = (
	rootName = "",
): InMemoryDirectoryHandle => {
	return InMemoryDirectoryHandle.makeRoot(rootName)
}
