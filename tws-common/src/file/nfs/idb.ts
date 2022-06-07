import {
	FileSystemWritableFileStream,
	FileSystemWritableFileStreamCommand,
	FileSystemWritableOptions,
} from "tws-common/file/nfs"

const storeName = "fsEntries"

const getIDBStore = (db: IDBDatabase): [IDBTransaction, IDBObjectStore] => {
	const tx = db.transaction(storeName, "readwrite") // is there a performance penalty for RW? I will assume that there is not.
	return [tx, tx.objectStore(storeName)]
}

/**
 * According to docs, all changes are preformed in-memory until close is called, which is when commit happens.
 * This is what this class does.
 *
 * File is stored 100% in memory, which in general is bad.
 * But we are willing to accept it.
 * 
 * Also error handling may be done badly below here.
 * IDB has really strange apis.
 */
class Writer implements FileSystemWritableFileStream {
	private position = 0
	constructor(
		private readonly db: IDBDatabase,
		private readonly id: IDBValidKey,
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

	close = (): Promise<void> => {
		return new Promise((resolve, reject) => {
			const [tx, table] = getIDBStore(this.db)
			table.get(this.id).onsuccess = evt => {
				;(evt.target as unknown as any)?.result
					? table.put(this.file, this.id)
					: reject(
							new DOMException(
								"File was removed while it was edited",
							),
					  )
			}
			tx.oncomplete = () => resolve()
			tx.onerror = reject
			tx.onabort = reject
		})
	}
}

export class IndexedDBFileHandle implements FileSystemFileHandle {
	constructor(
		private readonly db: IDBDatabase,
		private readonly id: IDBValidKey,
		public readonly name: string,
	) {}
	public readonly kind = "file"

	isSameEntry = async (other: FileSystemHandle): Promise<boolean> => {
		return other instanceof IndexedDBFileHandle && other.id === this.id
	}

	getFile = async (): Promise<File> => {
		const file = await new Promise<File>((resolve, reject) => {
			const [_, store] = getIDBStore(this.db)
			const idbRequest = store.get(this.id)
			idbRequest.onsuccess = evt =>
				resolve((evt as unknown as any).target.result)
			idbRequest.onerror = evt =>
				reject((evt as unknown as any).target.error)
		})
		if (!file) throw new DOMException("File does not exist")
		return file
	}

	createWritable = async (
		opts?: FileSystemWritableOptions,
	): Promise<FileSystemWritableFileStream> => {
		let file: File
		if (opts?.keepExistingData) {
			file = await this.getFile()
		} else {
			await this.getFile() // this throws if file does not exist, and it involves idb reading anyway, so leave as-is
			file = new File([], this.name)
		}

		return new Writer(this.db, this.id, file.size, file)
	}
}

export class IndexedDBDirectoryHandle implements FileSystemDirectoryHandle {
	constructor(
		private readonly db: IDBDatabase,
		private readonly id: IDBValidKey,
		public readonly name: string,
	) {}

	async *entries() {
		const [_, store] = getIDBStore(this.db)
		const query = store.get(this.id)

		await new Promise<void>((resolve, reject) => {
			query.onsuccess = () => resolve()
			query.onerror = () => reject(query.error)
		})
		const entries = query.result

		if (!entries) throw new DOMException("Listed directory was removed")
		for (const [name, [id, isFile]] of Object.entries(entries) as any) {
			yield [
				name,
				isFile
					? new IndexedDBFileHandle(this.db, id, name)
					: new IndexedDBDirectoryHandle(this.db, id, name),
			]
		}
	}

	async *keys() {
		const [_, store] = getIDBStore(this.db)
		const query = store.get(this.id)

		await new Promise<void>((resolve, reject) => {
			query.onsuccess = () => resolve()
			query.onerror = () => reject(query.error)
		})
		const entries = query.result

		if (!entries) throw new DOMException("Listed directory was removed")
		for (const [name, [id, isFile]] of Object.entries(entries) as any) {
			yield name
		}
	}

	async *values() {
		const [_, store] = getIDBStore(this.db)
		const query = store.get(this.id)

		await new Promise<void>((resolve, reject) => {
			query.onsuccess = () => resolve()
			query.onerror = () => reject(query.error)
		})
		const entries = query.result

		if (!entries) throw new DOMException("Listed directory was removed")
		for (const [name, [id, isFile]] of Object.entries(entries) as any) {
			yield isFile
				? new IndexedDBFileHandle(this.db, id, name)
				: new IndexedDBDirectoryHandle(this.db, id, name)
		}
	}

	[Symbol.asyncIterator] = this.entries

	getDirectoryHandle = (
		name: string,
		options?: FileSystemGetDirectoryOptions | undefined,
	): Promise<FileSystemDirectoryHandle> => {
		return new Promise((resolve, reject) => {
			const [_, store] = getIDBStore(this.db)
			const query = store.get(this.id)

			// TODO(teawithsand): handle failures
			query.onsuccess = () => {
				const entries = query.result
				const entry = entries[name]
				if (!entry) {
					if (options?.create) {
						store.add({}).onsuccess = evt => {
							const id = (evt as any).target.result
							entries[name] = [id, false]
							store.put(entries, this.id).onsuccess = () =>
								resolve(
									new IndexedDBDirectoryHandle(
										this.db,
										id,
										name,
									),
								)
						}
					}
					reject(new DOMException("Directory does not exist"))
					return
				}
				if (entry[1]) {
					reject(new DOMException("Directory is a file"))
					return
				}
				resolve(new IndexedDBDirectoryHandle(this.db, entry[0], name))
				return
			}
		})
	}

	removeEntry = (
		name: string,
		options?: FileSystemRemoveOptions | undefined,
	): Promise<void> => {
		return new Promise<void>((resolve, reject) => {
			const [tx, store] = getIDBStore(this.db)
			const query = store.get(this.id)

			query.onsuccess = evt => {
				const cwd = query.result
				if (!cwd[name]) {
					return reject(new DOMException("File was removed"))
				}
				delete cwd[name]
				store.put(cwd, this.id)

				const recursiveRemove = (
					evt: any,
					entriesToDelete: any,
					recursive: boolean,
				) => {
					const { source, result } = evt.target
					for (const [id, isFile] of entriesToDelete instanceof Array
						? entriesToDelete
						: Object.values(entriesToDelete) ||
						  Object.values(result)) {
						if (isFile) source.delete(id)
						else if (recursive) {
							source.get(id).onsuccess = recursiveRemove
							source.delete(id)
						} else {
							source.get(id).onsuccess = (evt: any) => {
								if (
									Object.keys(evt.target.result).length !== 0
								) {
									evt.target.transaction.abort()
								} else {
									source.delete(id)
								}
							}
						}
					}
				}
				recursiveRemove(evt, [cwd[name]], !!options?.recursive)
			}
			tx.oncomplete = () => resolve()
			tx.onerror = reject
			tx.onabort = () => {
				reject(new DOMException("Directory removal filed"))
			}
		})
	}

	resolve = (
		possibleDescendant: FileSystemHandle,
	): Promise<string[] | null> => {
		// I won't use it anyway
		throw new Error("NIY")
	}
	public readonly kind = "directory"

	isSameEntry = async (other: FileSystemHandle): Promise<boolean> => {
		return other instanceof IndexedDBDirectoryHandle && other.id === this.id
	}

	getFileHandle = async (
		name: string,
		options?: FileSystemGetFileOptions,
	): Promise<FileSystemFileHandle> => {
		return new Promise((resolve, reject) => {
			const [_, store] = getIDBStore(this.db)
			const query = store.get(this.id)
			// TODO(teawithsand): handle failures
			query.onsuccess = () => {
				const entries = query.result
				const entry = entries[name]
				if (entry && entry[1])
					resolve(
						new IndexedDBFileHandle(
							this.db,
							entry[0] as IDBValidKey,
							name,
						),
					)
				if (entry && !entry[1])
					reject(new DOMException("File is a directory"))
				if (!entry && !options?.create)
					reject(
						new DOMException(
							"File does not exist and create flag is not set",
						),
					)
				if (!entry && options?.create) {
					const q = store.put(new File([], name))
					q.onsuccess = () => {
						const id = q.result
						entries[name] = [id, true]
						const query = store.put(entries, this.id)
						query.onsuccess = () => {
							resolve(new IndexedDBFileHandle(this.db, id, name))
						}
					}
				}
			}
		})
	}
}

export const getIndexedDBFileSystem = (
	name: string,
): Promise<FileSystemHandle> => {
	return new Promise(resolve => {
		const request = indexedDB.open(name)

		request.onupgradeneeded = () => {
			const db = request.result
			db.createObjectStore(storeName, {
				autoIncrement: true,
			}).transaction.oncomplete = () => {
				db.transaction(storeName, "readwrite")
					.objectStore(storeName)
					.add({})
			}
		}

		request.onsuccess = () => {
			resolve(new IndexedDBDirectoryHandle(request.result, 1, ""))
		}
	})
}
