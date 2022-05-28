import { concatArrayBuffers } from "@app/util/lang/arrayBuffer"
import { collectAsyncIterable } from "@app/util/lang/asyncIterator"
import { arrayBufferFromBytes } from "@app/util/lang/buffer"
import { iterateOverReader } from "@app/util/lang/readableStream"
import FileStore from "@app/util/sfs/FileStore"
import InMemoryFileStore from "@app/util/sfs/InMemoryFileStore"

const testFileStore = (
	name: string,
	provider: () => Promise<FileStore>,
	cleanup: () => Promise<void>,
) => {
	describe(name, () => {
		let fileStore: FileStore
		beforeEach(async () => {
			fileStore = await provider()
		})

		afterEach(async () => {
			await cleanup()
		})

		it.each([
			[
				[
					arrayBufferFromBytes([10, 20, 30]),
					arrayBufferFromBytes([10, 20, 30]),
				],
			],
			[
				[
					arrayBufferFromBytes([10, 20, 30]),
					arrayBufferFromBytes([10, 20, 30]),
				],
			],
		])("can store and read file", async chunks => {
			const data = concatArrayBuffers(...chunks)
			const writer = (await fileStore.write("/asdf.txt")).getWriter()
			try {
				for (const c of chunks) {
					await writer.write(c)
				}
			} finally {
				await writer.close()
			}

			const reader = (await fileStore.read("/asdf.txt")).getReader()
			try {
				const readData = concatArrayBuffers(
					...(await collectAsyncIterable(iterateOverReader(reader))),
				)

				expect(readData).toEqual(data)
			} finally {
				await reader.cancel()
			}
		})
	})
}

testFileStore(
	"InMemoryFileStore",
	async () => new InMemoryFileStore(),
	async () => {
		//noop
	},
)
