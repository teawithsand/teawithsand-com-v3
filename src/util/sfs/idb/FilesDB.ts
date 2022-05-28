import {
	deleteDB,
	IDBPDatabase,
	IDBPTransaction,
	openDB,
} from "idb/with-async-ittr"

import { concatArrayBuffers } from "@app/util/lang/arrayBuffer"

const CHUNK_STORE_NAME = "chunks"
const PARTIAL_CHUNK_STORE_NAME = "partial_chunks"

const PATH_OFFSET_CHUNK_INDEX_NAME = "pathOffsetChunkIndex"
const PATH_PARTIAL_CHUNK_INDEX_NAME = "pathPartialChunkIndex"

const CHUNK_SIZE = 1024 * 128 // these should be quite big, since path is replicated to each chunk

export type DBFileChunk = {
	id: number
	path: string
	chunkOffset: number
	data: ArrayBufferLike
}

export type DBFilePartialChunk = {
	id: number
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
				}

				if (!db.objectStoreNames.contains(PARTIAL_CHUNK_STORE_NAME)) {
					const os = db.createObjectStore(PARTIAL_CHUNK_STORE_NAME, {
						keyPath: "id",
						autoIncrement: true,
					})
					os.createIndex(PATH_PARTIAL_CHUNK_INDEX_NAME, ["path"], {
						unique: true,
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
		const index = store.index(PATH_PARTIAL_CHUNK_INDEX_NAME)
		const res = (await index.get(path)) as
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
		const index = store.index(PATH_PARTIAL_CHUNK_INDEX_NAME)
		const v = await index.get(path)
		if (v) await store.delete(v.id)
	}

	private setPartialChunk = async (
		path: string,
		data: ArrayBuffer,
		tx: IDBPTransaction<DBSchema, string[], "readwrite">,
	) => {
		const store = tx.objectStore(PARTIAL_CHUNK_STORE_NAME)

		const index = store.index(PATH_PARTIAL_CHUNK_INDEX_NAME)
		const v = await index.get(path)
		if (v) await store.delete(v.id)

		await store.put({
			data,
			path,
		} as DBFilePartialChunk)
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

	private appendChunk = async (
		path: string,
		data: ArrayBuffer,
		tx: IDBPTransaction<DBSchema, string[], "readwrite">,
	) => {
		if (data.byteLength !== CHUNK_SIZE) {
			throw new Error(
				`Expected chunk to be ${CHUNK_SIZE} got ${data.byteLength}`,
			)
		}

		let chunkOffset = 0

		const store = tx.objectStore(CHUNK_STORE_NAME)
		{
			const index = store.index(PATH_OFFSET_CHUNK_INDEX_NAME)
			const cursor = await index.openCursor([path], "prev")

			if (cursor) {
				const v: DBFileChunk = cursor.value
				chunkOffset = v.chunkOffset + 1
			}
		}

		await store.put({
			data,
			chunkOffset,
			path,
		})
	}

	private deleteChunks = async (
		path: string,
		tx: IDBPTransaction<DBSchema, string[], "readwrite">,
	) => {
		const store = tx.objectStore(CHUNK_STORE_NAME)
		const index = store.index(PATH_PARTIAL_CHUNK_INDEX_NAME)
		for await (const cursor of index.iterate(path)) {
			await cursor.delete()
		}
	}

	getFileChunk = async (
		path: string,
		chunkIndex: number,
	): Promise<ArrayBuffer | null> => {
		const tx = this.getReadTx()

		try {
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
		} finally {
			tx.abort()
		}
	}

	getFilePartialChunk = async (path: string) => {
		const tx = this.getReadTx()
		try {
			return this.getPartialChunk(path, tx)
		} finally {
			tx.abort()
		}
	}

	getFileChunkCount = async (path: string) => {
		const tx = this.getReadTx()
		try {
			return this.getChunkCount(path, tx)
		} finally {
			tx.abort()
		}
	}

	/**
	 * Deletes file, if one exists.
	 */
	deleteFile = async (path: string) => {
		const tx = this.getWriteTx()
		try {
			await this.deletePartialChunk(path, tx)
			await this.deleteChunks(path, tx)
		} catch (e) {
			tx.abort()
			throw e
		} finally {
			tx.commit()
		}
	}

	iterateOverPaths = () => {
		const tx = this.getReadTx()
		async function* gen() {
			try {
				const store = tx.objectStore(PARTIAL_CHUNK_STORE_NAME)
				const index = store.index(PATH_PARTIAL_CHUNK_INDEX_NAME)

				for await (const cursor of index.iterate(null)) {
					yield cursor.value.path
				}
			} finally {
				tx.abort()
			}
		}

		return gen()
	}

	/**
	 * Writes given chunk at the end of file.
	 */
	writeFileChunk = async (path: string, data: ArrayBuffer) => {
		const tx = this.getWriteTx()
		try {
			const partial = await this.getPartialChunk(path, tx)
			let toWriteBuffer = concatArrayBuffers(
				partial ?? new ArrayBuffer(0),
				data,
			)

			// actually, this shouldn't execute more than once
			while (toWriteBuffer.byteLength >= CHUNK_SIZE) {
				const writePart = toWriteBuffer.slice(0, CHUNK_SIZE)
				await this.appendChunk(path, writePart, tx)

				toWriteBuffer = toWriteBuffer.slice(CHUNK_SIZE)
			}

			await this.setPartialChunk(path, toWriteBuffer, tx)
		} catch (e) {
			tx.abort()
			throw e
		} finally {
			tx.commit()
		}
	}
}
