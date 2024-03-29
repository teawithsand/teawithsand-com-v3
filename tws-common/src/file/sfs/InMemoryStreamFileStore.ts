import FileStoreError, {
	FileStoreErrorCode,
} from "tws-common/file/sfs/FileStoreError"
import { assemblePath, Path } from "tws-common/file/sfs/Path"
import StreamFileStore, {
	DEFAULT_WRITE_MODE,
	FileInfo,
	ReadOptions,
	WriteMode,
	WriteOptions,
} from "tws-common/file/sfs/StreamFileStore"
import { concatArrayBuffers } from "tws-common/lang/arrayBuffer"
import { makeAsyncIterable } from "tws-common/lang/asyncIterable"

export default class InMemoryStreamFileStore implements StreamFileStore {
	private entries: Map<string, ArrayBuffer> = new Map()

	stat = async (path: Path): Promise<FileInfo | null> => {
		const key = assemblePath(path)

		const e = this.entries.get(key)
		if (!e) return null

		return {
			size: e.byteLength,
		}
	}

	read = async (path: Path, options?: ReadOptions) => {
		const { offset, limit } = options ?? {}

		const key = assemblePath(path)
		const e = this.entries.get(key)
		if (!e) {
			throw new FileStoreError(
				`Path ${path} does not exist`,
				FileStoreErrorCode.NOT_FOUND,
			)
		}

		return new ReadableStream({
			start(controller) {
				let buffer = e
				if (typeof offset === "number") {
					buffer = e.slice(offset)
				}
				if (typeof limit === "number") {
					buffer = e.slice(0, limit)
				}
				// no reason not to handle reading files like that
				// we can just enqueue single buffer
				controller.enqueue(buffer)
				controller.close()
			},
		})
	}

	write = async (path: Path, options?: WriteOptions) => {
		const key = assemblePath(path)
		const e = this.entries.get(key)

		const mode = options?.mode ?? DEFAULT_WRITE_MODE

		let buf =
			mode === WriteMode.Append
				? new ArrayBuffer(0)
				: e ?? new ArrayBuffer(0)

		this.entries.set(key, buf)

		return new WritableStream({
			write: async chunk => {
				buf = concatArrayBuffers(buf, chunk)
				this.entries.set(key, buf)
			},
		})
	}
	delete = async (prefix: Path) => {
		const path = assemblePath(prefix)
		for (const k of this.entries.keys()) {
			if (k.startsWith(path)) {
				this.entries.delete(k)
			}
		}
	}
	list = (prefix: Path) => {
		const path = assemblePath(prefix)
		return makeAsyncIterable(
			[...this.entries.keys()]
				.filter(k => k.startsWith(path))
				.map(v => v),
		)
	}
}
