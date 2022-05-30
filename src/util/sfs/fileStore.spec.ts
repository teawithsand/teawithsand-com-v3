import { concatArrayBuffers } from "@app/util/lang/arrayBuffer"
import { collectAsyncIterable } from "@app/util/lang/asyncIterator"
import { arrayBufferFromBytes } from "@app/util/lang/buffer"
import { iterateOverReader } from "@app/util/lang/readableStream"
import FileStore from "@app/util/sfs/FileStore"
import FilesDB from "@app/util/sfs/idb/FilesDB"
import IndexedDBFileStore from "@app/util/sfs/idb/IndexedDBFileStore"
import InMemoryFileStore from "@app/util/sfs/InMemoryFileStore"

const testFileStore = <T extends FileStore>(
	name: string,
	provider: () => Promise<T>,
	cleanup: (res: T) => Promise<void>,
) => {
	describe(name, () => {
		let fileStore: T
		beforeEach(async () => {
			fileStore = await provider()
		})

		afterEach(async () => {
			await cleanup(fileStore)
		})

		it.each([[[arrayBufferFromBytes([10, 20, 30])]], [[]]])(
			"can store and read file",
			async chunks => {
				const data = concatArrayBuffers(...chunks)
				const writer = (await fileStore.write("/asdf.txt")).getWriter()

				for (const c of chunks) {
					await writer.write(c)
				}
				await writer.close()

				const reader = (await fileStore.read("/asdf.txt")).getReader()
				try {
					const readData = concatArrayBuffers(
						...(await collectAsyncIterable(
							iterateOverReader(reader),
						)),
					)

					expect(readData).toEqual(data)
				} finally {
					await reader.cancel()
				}
			},
		)
	})
}

testFileStore(
	"InMemoryFileStore",
	async () => new InMemoryFileStore(),
	async () => {
		//noop
	},
)

testFileStore(
	"IndexedDBFileStore",
	async () => {
		const db = await FilesDB.open("db1")
		await db.delete()

		return new IndexedDBFileStore(await FilesDB.open("db1"))
	},
	async res => {
		await res.disownFilesDB().close()
	},
)
