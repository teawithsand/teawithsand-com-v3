import { IDBPDatabase, openDB } from "idb/with-async-ittr"

import { concatArrayBuffers } from "@app/util/lang/arrayBuffer"
import FileStore, { WriteMode } from "@app/util/sfs/FileStore"
import FileStoreError from "@app/util/sfs/FileStoreError"
import { assemblePath, Path } from "@app/util/sfs/Path"

const METADATA_STORE_NAME = "files"
const CHUNK_STORE_NAME = "chunks"

const CHUNK_FILE_ID_INDEX_INDEX_NAME = "offsetIndex"
const CHUNK_FILE_ID_INDEX_NAME = "fileIdIndex"

export const openFileDB = async (name: string) => {
	return await openDB(name, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
				db.createObjectStore(METADATA_STORE_NAME, {
					keyPath: "path",
				})
			}
			if (!db.objectStoreNames.contains(CHUNK_STORE_NAME)) {
				const os = db.createObjectStore(CHUNK_STORE_NAME, {
					keyPath: "id",
					autoIncrement: true,
				})
				os.createIndex(
					CHUNK_FILE_ID_INDEX_INDEX_NAME,
					["fileId", "index"],
					{
						unique: true,
					},
				)
				os.createIndex(CHUNK_FILE_ID_INDEX_NAME, ["fileId", "index"])
			}
		},
	})
}

const FLUSH_BUFFER_SIZE = 1024 * 16

export default class IndexedDBFileStore implements FileStore {
	constructor(
		private readonly db: IDBPDatabase<{
			files: {
				id: number
				path: string
				chunkCount: number
			}
			chunks: {
				id: number
				fileId: number
				index: number
				data: ArrayBufferLike
			}
		}>,
	) {}

	read = async (key: Path): Promise<ReadableStream<ArrayBuffer>> => {
		const path = assemblePath(key)
		const tx = this.db.transaction(METADATA_STORE_NAME, "readonly")
		let fileId: number
		let chunkCount: number
		try {
			const store = tx.objectStore(METADATA_STORE_NAME)
			const res = await store.get(path)

			if (!res) {
				throw new FileStoreError(
					`File with path ${path} does not exist`,
					res,
				)
			}

			fileId = res.id
			chunkCount = res.chunkCount
		} finally {
			tx.abort()
		}

		let offset = 0

		return new ReadableStream({
			pull: async controller => {
				while (offset < chunkCount) {
					const tx = this.db.transaction(CHUNK_STORE_NAME, "readonly")
					try {
						const store = tx.objectStore(CHUNK_STORE_NAME)
						const idx = store.index(CHUNK_FILE_ID_INDEX_INDEX_NAME)

						const chunk = await idx.get([fileId, offset])

						if (!chunk) {
							continue
						}

						const data = chunk.data
						offset += 1
						controller.enqueue(data)
						break // we are not interested in queuing more than required
					} finally {
						tx.abort()
					}
				}

				if (offset >= chunkCount) {
					controller.close()
				}
			},
		})
	}

	write = async (
		key: Path,
		mode: WriteMode,
	): Promise<WritableStream<ArrayBuffer>> => {
		const path = assemblePath(key)
		const tx = this.db.transaction(METADATA_STORE_NAME, "readwrite")
		let fileId: number

		try {
			const store = tx.objectStore(METADATA_STORE_NAME)
			const res = await store.get(path)

			if (mode === WriteMode.Override || !res) {
				await store.put(
					{
						path,
						chunkCount: 0,
					},
					path,
				)
			}

			const validRes = await store.get(path)

			fileId = validRes.id
		} finally {
			tx.abort()
		}

		let inMemBuffer = new ArrayBuffer(0)

		const writeBuffer = async (buf: ArrayBuffer) => {
			const tx = this.db.transaction(
				[METADATA_STORE_NAME, CHUNK_STORE_NAME],
				"readwrite",
			)

			try {
				const metadataStore = tx.objectStore(METADATA_STORE_NAME)
				const metadata = await metadataStore.get(path)
				const newChunkIndex = metadata.chunkCount

				metadata.chunkCount += 1
				await metadataStore.put(metadata, path)

				const chunkStore = tx.objectStore(CHUNK_STORE_NAME)

				await chunkStore.put({
					fileId,
					data: buf,
					index: newChunkIndex,
				})
			} finally {
				tx.commit()
			}
		}

		return new WritableStream({
			write: async chunk => {
				inMemBuffer = concatArrayBuffers(inMemBuffer, chunk)
				if (inMemBuffer.byteLength > FLUSH_BUFFER_SIZE) {
					await writeBuffer(inMemBuffer)
					inMemBuffer = new ArrayBuffer(0)
				}
			},
			close: () => {
				if (inMemBuffer.byteLength > 0) {
					writeBuffer(inMemBuffer)
					inMemBuffer = new ArrayBuffer(0)
				}
			},
		})
	}

	delete = async (prefix: Path): Promise<void> => {
		const path = assemblePath(prefix)
		const tx = this.db.transaction(
			[METADATA_STORE_NAME, CHUNK_STORE_NAME],
			"readwrite",
		)
		try {
			const metadataStore = tx.objectStore(METADATA_STORE_NAME)
			const chunkStore = tx.objectStore(CHUNK_STORE_NAME)
			const chunkIndex = chunkStore.index(CHUNK_FILE_ID_INDEX_NAME)
			const toRemoveFileIds = new Set<string>()

			for await (const cursor of metadataStore.iterate()) {
				const value = cursor.value
				if (value.path.startsWith(path)) {
					toRemoveFileIds.add(value.path)
				}
			}

			for (const key of toRemoveFileIds) {
				const value = await metadataStore.get(key)
				await metadataStore.delete(key)

				const toRemoveChunkIds = new Set<number>()
				for await (const cursor of chunkIndex.iterate(value.fileId)) {
					toRemoveChunkIds.add(cursor.value.id)
				}

				for (const id of toRemoveChunkIds) {
					chunkStore.delete(id)
				}
			}
		} finally {
			tx.commit()
		}
	}

	list = (prefix: Path): AsyncIterable<string> => {
		const path = assemblePath(prefix)

		async function* gen() {
			const tx = this.db.transaction([METADATA_STORE_NAME], "readonly")
			const metadataStore = tx.objectStore(METADATA_STORE_NAME)
			for await (const cursor of metadataStore.iterate()) {
				const value = cursor.value
				if (value.path.startsWith(path)) {
					yield value.path
				}
			}
		}

		return gen()
	}
}
