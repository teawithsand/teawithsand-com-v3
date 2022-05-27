import FileStore, {
	Path,
	Reader,
	WriteMode,
	Writer,
} from "@app/util/sfs/FileStore"
import FileStoreError, {
	FileStoreErrorCode,
} from "@app/util/sfs/FileStoreError"
import { canonizePath, makeAsyncIterable } from "@app/util/sfs/path"

const innerCanonizePath = (path: Path): string => {
	if (path instanceof Array) {
		path = path.join("/")
	}
	return canonizePath(path)
}

export default class InMemoryFileStore implements FileStore {
	private entries: Map<string, ArrayBuffer> = new Map()

	openForReading = async (key: string | string[]): Promise<Reader> => {
		const path = innerCanonizePath(key)

		// memorizing file is ok I guess

		const getFile = () => {
			const file = this.entries.get(path)
			if (!file)
				throw new FileStoreError(
					`File for path ${path} was not found`,
					FileStoreErrorCode.NOT_FOUND,
				)
			return file
		}

		let pos = 0

		return {
			read: async buf => {
				const file = getFile()

				const bufView = new Uint8Array(buf)
				const srcBuffer = new Uint8Array(
					file.slice(pos, buf.byteLength),
				)

				bufView.set(srcBuffer)

				pos += srcBuffer.length
				return srcBuffer.length
			},
			readAll: async (): Promise<ArrayBuffer> => getFile().slice(pos),
			close: async (): Promise<void> => {
				// it's in memory
			},
		}
	}

	openForWriting = async (
		key: string | string[],
		mode: WriteMode,
	): Promise<Writer> => {
		const path = innerCanonizePath(key)

		const file = this.entries.get(path)

		let fileBuffer = file ?? new ArrayBuffer(0)
		if (file && mode === WriteMode.Override) {
			fileBuffer = new ArrayBuffer(0)
			this.entries.set(path, fileBuffer)
		}

		if (!file) this.entries.set(path, fileBuffer)

		return {
			write: async buf => {
				const newFileBuffer = new ArrayBuffer(
					fileBuffer.byteLength + buf.byteLength,
				)
				const newFileBufferView = new Uint8Array(newFileBuffer)
				newFileBufferView.set(new Uint8Array(fileBuffer), 0)
				newFileBufferView.set(
					new Uint8Array(buf),
					fileBuffer.byteLength,
				)

				fileBuffer = newFileBuffer
				this.entries.set(path, fileBuffer)

				return buf.byteLength
			},
			close: async () => {
				// noop, it's in memory store
			},
		}
	}

	delete = async (prefix: string | string[]): Promise<void> => {
		const path = innerCanonizePath(prefix)
		const toDelete = new Set<string>()
		for (const k of this.entries.keys()) {
			if (k.startsWith(path)) {
				toDelete.add(k)
			}
		}
		for (const v of toDelete.values()) {
			this.entries.delete(v)
		}
	}

	list = (prefix: string | string[]): AsyncIterable<string> => {
		const path = innerCanonizePath(prefix)
		return makeAsyncIterable(
			[...this.entries.keys()].filter(k => k.startsWith(path)).map(v => "/" + v),
		)
	}
}
