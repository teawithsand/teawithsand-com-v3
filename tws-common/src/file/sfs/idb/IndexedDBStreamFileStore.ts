import FileStoreError, { FileStoreErrorCode } from "tws-common/file/sfs/FileStoreError"
import FilesDB from "tws-common/file/sfs/idb/FilesDB"
import { assemblePath, Path } from "tws-common/file/sfs/Path"
import StreamFileStore, { DEFAULT_WRITE_MODE, ReadOptions, WriteMode, WriteOptions } from "tws-common/file/sfs/StreamFileStore"
import { concatArrayBuffers } from "tws-common/lang/arrayBuffer"

export default class IndexedDBStreamFileStore implements StreamFileStore {
	constructor(private readonly filesDb: FilesDB) {}

	disownFilesDB = (): FilesDB => {
		return this.filesDb
	}

	stat = async (key: Path) => {
		const path = assemblePath(key)
		const partialLength = (await this.filesDb.getFilePartialChunk(path))
			?.byteLength
		if (typeof partialLength !== "number") return null
		const cc = await this.filesDb.getFileChunkCount(path)

		return {
			size: cc * this.filesDb.chunkSize + partialLength,
		}
	}

	read = async (
		key: Path,
		options: ReadOptions,
	): Promise<ReadableStream<ArrayBuffer>> => {
		const path = assemblePath(key)

		const { limit, offset } = options ?? {}

		const partial = await this.filesDb.getFilePartialChunk(path)
		if (!partial)
			throw new FileStoreError(
				`File with path ${path} was not found`,
				FileStoreErrorCode.NOT_FOUND,
			)

		const chunkCount = await this.filesDb.getFileChunkCount(path)
		let chunkOffset = 0

		const getNextChunk = async () => {
			try {
				if (chunkOffset === chunkCount) {
					const partial = await this.filesDb.getFilePartialChunk(path)
					return partial
				} else if (chunkOffset > chunkCount) {
					// noop, return null
				} else {
					const chunk = await this.filesDb.getFileChunk(
						path,
						chunkOffset,
					)
					if (chunk) return chunk
				}
				return null
			} finally {
				chunkOffset++
			}
		}

		let bytesRead = 0
		let bytesEmitted = 0

		return new ReadableStream({
			pull: async controller => {
				for (;;) {
					const chunk = await getNextChunk()
					if (!chunk) {
						controller.close()
						break
					}
					bytesRead += chunk.byteLength

					let chunkToEnqueue: ArrayBuffer | null = null

					if (typeof offset === "number") {
						if (offset > bytesRead) {
							// noop
						} else if (offset > bytesRead - chunk.byteLength) {
							const part = chunk.slice(offset - bytesRead)
							chunkToEnqueue = part
						} else {
							chunkToEnqueue = chunk
						}
					}

					if (!chunkToEnqueue) {
						continue
					}

					if (typeof limit === "number") {
						if (bytesEmitted + chunkToEnqueue.byteLength > limit) {
							const partOfPart = chunkToEnqueue.slice(
								0,
								limit - bytesEmitted,
							)

							controller.enqueue(partOfPart)
							bytesEmitted += partOfPart.byteLength
							controller.close()
							break
						} else {
							controller.enqueue(chunkToEnqueue)
							bytesEmitted += chunkToEnqueue.byteLength
						}
					} else {
						controller.enqueue(chunkToEnqueue)
						bytesEmitted += chunkToEnqueue.byteLength
					}
				}
			},
		})
	}

	write = async (
		key: Path,
		options?: WriteOptions,
	): Promise<WritableStream<ArrayBuffer>> => {
		const path = assemblePath(key)
		const mode = options?.mode ?? DEFAULT_WRITE_MODE

		if (mode === WriteMode.Override) {
			await this.filesDb.deleteFile(path)
		}

		let chunkBuffer = new ArrayBuffer(0)
		let performedAnyWrite = false

		return new WritableStream({
			write: async data => {
				chunkBuffer = concatArrayBuffers(chunkBuffer, data)
				while (chunkBuffer.byteLength >= data.byteLength) {
					const chunk = chunkBuffer.slice(0, this.filesDb.chunkSize)
					chunkBuffer = chunkBuffer.slice(this.filesDb.chunkSize)

					performedAnyWrite = true
					await this.filesDb.writeFileChunk(path, chunk)
				}
			},
			close: async () => {
				if (chunkBuffer.byteLength > 0 || !performedAnyWrite) {
					performedAnyWrite = true
					await this.filesDb.writeFileChunk(path, chunkBuffer)
				}
			},
		})
	}

	delete = async (prefix: Path): Promise<void> => {
		const path = assemblePath(prefix)
		await this.filesDb.deleteFile(path)
	}

	list = (prefix: Path): AsyncIterable<string> => {
		const pref = assemblePath(prefix)
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this
		async function* gen() {
			for await (const e of self.filesDb.iterateOverPaths()) {
				if (e.startsWith(pref)) {
					yield e
				}
			}
		}

		return gen()
	}
}
