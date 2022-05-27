import FileStore, { Reader, WriteMode, Writer } from "@app/util/sfs/FileStore";
import FileStoreError, { FileStoreErrorCode } from "@app/util/sfs/FileStoreError";
import { canonizePathParts, makeAsyncIterable } from "@app/util/sfs/path";


export default class InMemoryFileStore implements FileStore {
	private entries: Map<string, ArrayBuffer> = new Map()

	openForReading = async (key: string | string[]): Promise<Reader> => {
		const path = canonizePathParts(key)

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

		const file = getFile()

		return {
			readToBuffer: async buf => {
				const bufView = new Uint8Array(buf)
				const srcBuffer = new Uint8Array(
					file.slice(pos, buf.byteLength),
				)

				bufView.set(srcBuffer)

				pos += srcBuffer.length
				return srcBuffer.length
			},
			read: async () => {
				const buf = new ArrayBuffer(4096)

				const bufView = new Uint8Array(buf)
				const srcBuffer = new Uint8Array(
					file.slice(pos, buf.byteLength),
				)

				bufView.set(srcBuffer)

				pos += srcBuffer.length
				return buf.slice(0, srcBuffer.length)
			},
			readAll: async (): Promise<ArrayBuffer> => file.slice(pos),
			close: async (): Promise<void> => {
				// it's in memory
			},
		}
	}

	openForWriting = async (
		key: string | string[],
		mode: WriteMode,
	): Promise<Writer> => {
		const path = canonizePathParts(key)

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
		const path = canonizePathParts(prefix)
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
		const path = canonizePathParts(prefix)
		return makeAsyncIterable(
			[...this.entries.keys()]
				.filter(k => k.startsWith(path))
				.map(v => "/" + v),
		)
	}
}