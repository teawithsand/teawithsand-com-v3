import FileStore, { ReadOptions, WriteOptions } from "@app/util/sfs/FileStore"
import FilesDB from "@app/util/sfs/idb/FilesDB"
import { assemblePath, Path } from "@app/util/sfs/Path"

export default class IndexedDBFileStore implements FileStore {
	constructor(private readonly filesDb: FilesDB) {}

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
		throw new Error("NIY")
	}

	write = async (
		key: Path,
		options?: WriteOptions,
	): Promise<WritableStream<ArrayBuffer>> => {
		throw new Error("NIY")
	}

	delete = async (prefix: Path): Promise<void> => {
		// this.filesDb.delete()
	}

	list = (prefix: Path): AsyncIterable<string> => {
		throw new Error("NIY")
	}
}
