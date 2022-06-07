import {
	deleteDB,
	IDBPDatabase,
	IDBPTransaction,
	openDB,
} from "idb/with-async-ittr"

import { concatArrayBuffers } from "tws-common/lang/arrayBuffer"
import {
	preventTransactionCloseOnError,
	useIDBPTransaction,
	useIDBPTransactionAbortOnly,
} from "tws-common/webapi/idb/transaction"

const CHUNK_STORE_NAME = "chunks"
const PARTIAL_CHUNK_STORE_NAME = "partial_chunks"

const PATH_OFFSET_CHUNK_INDEX_NAME = "pathOffsetChunkIndex"
const PATH_CHUNK_INDEX_NAME = "pathChunkIndex"

const CHUNK_SIZE = 1024 * 128 // these should be quite big, since path is replicated to each chunk

export type DBFileChunk = {
	id: number
	path: string
	chunkOffset: number
	data: ArrayBufferLike
}

export type DBFilePartialChunk = {
	path: string
	data: ArrayBufferLike
}

type DBSchema = {
	chunks: DBFileChunk
}

/**
 * Low level implementation of storage used to store files.
 */
export default class FilesDB {
	readonly chunkSize = CHUNK_SIZE

	static async open(name: string) {
		const db = await openDB<DBSchema>(name, 1, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(CHUNK_STORE_NAME)) {
					const os = db.createObjectStore(CHUNK_STORE_NAME, {
						keyPath: "id",
						autoIncrement: true,
					})
					os.createIndex(
						PATH_OFFSET_CHUNK_INDEX_NAME,
						["path", "chunkOffset"],
						{
							unique: true,
						},
					)
					os.createIndex(PATH_CHUNK_INDEX_NAME, ["path"])
				}

				if (!db.objectStoreNames.contains(PARTIAL_CHUNK_STORE_NAME)) {
					db.createObjectStore(PARTIAL_CHUNK_STORE_NAME, {
						keyPath: "path",
					})
				}
			},
		})

		return new FilesDB(name, db)
	}

	private constructor(
		private readonly name: string,
		private readonly db: IDBPDatabase<DBSchema>,
	) {}

	close = async () => {
		this.db.close()
	}

	delete = async () => {
		await this.close()
		await deleteDB(this.name)
	}

	private readonly getReadTx = () =>
		this.db.transaction(
			[CHUNK_STORE_NAME, PARTIAL_CHUNK_STORE_NAME],
			"readonly",
		)

	private readonly getWriteTx = () =>
		this.db.transaction(
			[CHUNK_STORE_NAME, PARTIAL_CHUNK_STORE_NAME],
			"readwrite",
		)

	private getPartialChunk = async (
		path: string,
		tx: IDBPTransaction<DBSchema, string[], "readonly" | "readwrite">,
	) => {
		const store = tx.objectStore(PARTIAL_CHUNK_STORE_NAME)
		const res = (await preventTransactionCloseOnError(store.get(path))) as
			| DBFilePartialChunk
			| undefined
			| null
		if (!res) return null
		return res.data
	}

	private deletePartialChunk = async (
		path: string,
		tx: IDBPTransaction<DBSchema, string[], "readwrite">,
	) => {
		const store = tx.objectStore(PARTIAL_CHUNK_STORE_NAME)
		const v = await store.get(path)
		if (v) await store.delete(path)
	}

	private setPartialChunk = async (
		path: string,
		data: ArrayBuffer,
		tx: IDBPTransaction<DBSchema, string[], "readwrite">,
	) => {
		const store = tx.objectStore(PARTIAL_CHUNK_STORE_NAME)
		const v = await store.get(path)
		if (v) await store.delete(path)

		await store.put({
			data,
			path,
		})
	}

	private getChunkCount = async (
		path: string,
		tx: IDBPTransaction<DBSchema, string[], "readonly">,
	) => {
		const store = tx.objectStore(CHUNK_STORE_NAME)

		const index = store.index(PATH_OFFSET_CHUNK_INDEX_NAME)
		const cursor = await index.openCursor([path], "prev")

		if (cursor) {
			const v: DBFileChunk = cursor.value
			return v.chunkOffset + 1
		}
		return 0
	}

	private deleteChunks = async (
		path: string,
		tx: IDBPTransaction<DBSchema, string[], "readwrite">,
	) => {
		const store = tx.objectStore(CHUNK_STORE_NAME)
		const index = store.index(PATH_CHUNK_INDEX_NAME)
		for await (const cursor of index.iterate(path)) {
			await cursor.delete()
		}
	}

	getFileChunk = async (
		path: string,
		chunkIndex: number,
	): Promise<ArrayBuffer | null> => {
		const tx = this.getReadTx()

		return await useIDBPTransactionAbortOnly(tx, async tx => {
			const store = tx.objectStore(CHUNK_STORE_NAME)
			const index = store.index(PATH_OFFSET_CHUNK_INDEX_NAME)
			const cursor = await index.openCursor([path], "next")
			if (!cursor) {
				return null
			}
			if (chunkIndex > 0) {
				const newCursor = await cursor.advance(chunkIndex)
				if (!newCursor) {
					return null
				}

				const c = newCursor.value as DBFileChunk
				return c.data
			}

			return null
		})
	}

	getFilePartialChunk = async (path: string) => {
		const tx = this.getReadTx()

		return await useIDBPTransactionAbortOnly(tx, async tx => {
			const FilePartialChunk = await this.getPartialChunk(path, tx)
			return FilePartialChunk
		})
	}

	getFileChunkCount = async (path: string) => {
		const tx = this.getReadTx()
		return await useIDBPTransactionAbortOnly(
			tx,
			async tx => await this.getChunkCount(path, tx),
		)
	}

	/**
	 * Deletes file, if one exists.
	 */
	deleteFile = async (path: string) => {
		const tx = this.getWriteTx()
		await useIDBPTransaction(tx, async tx => {
			await this.deletePartialChunk(path, tx)
			await this.deleteChunks(path, tx)
		})
	}

	iterateOverPaths = () => {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this
		async function* gen() {
			const tx = self.getReadTx()
			const res = await useIDBPTransactionAbortOnly(tx, async tx => {
				const store = tx.objectStore(PARTIAL_CHUNK_STORE_NAME)

				const res: string[] = []
				for await (const cursor of store.iterate(null)) {
					// This is bad, it may cause idb transaction to fail.
					// Sync receiver would be better
					// for now bypass this via returning array
					res.push(cursor.value.path as string)
				}

				return res
			})
			for (const v of res) {
				yield v
			}
		}

		return gen()
	}

	/**
	 * Writes given chunk at the end of file.
	 */
	writeFileChunk = async (path: string, data: ArrayBuffer) => {
		await useIDBPTransaction(this.getWriteTx(), async tx => {
			const partial = await this.getPartialChunk(path, tx)
			let toWriteBuffer = concatArrayBuffers(
				partial ?? new ArrayBuffer(0),
				data,
			)

			const store = tx.objectStore(CHUNK_STORE_NAME)
			const index = store.index(PATH_OFFSET_CHUNK_INDEX_NAME)

			let chunkOffset = 0
			{
				const cursor = await index.openCursor(
					IDBKeyRange.bound(
						[path, 0],
						[path, 2 ** 32 - 1],
						false,
						false,
					),
					"prev",
				)

				if (cursor) {
					const v: DBFileChunk = cursor.value
					chunkOffset = v.chunkOffset + 1
				}
			}

			// actually, this shouldn't execute more than once
			while (toWriteBuffer.byteLength >= CHUNK_SIZE) {
				const writePart = toWriteBuffer.slice(0, CHUNK_SIZE)

				await preventTransactionCloseOnError(
					store.put({
						data: writePart,
						chunkOffset,
						path,
					}),
				)
				chunkOffset++

				toWriteBuffer = toWriteBuffer.slice(CHUNK_SIZE)
			}

			await this.setPartialChunk(path, toWriteBuffer, tx)
		})
	}
}
