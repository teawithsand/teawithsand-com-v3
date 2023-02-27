import FilesDB from "tws-common/file/sfs/idb/FilesDB"
import IndexedDBStreamFileStore from "tws-common/file/sfs/idb/IndexedDBStreamFileStore"
import InMemoryStreamFileStore from "tws-common/file/sfs/InMemoryStreamFileStore"
import StreamFileStore from "tws-common/file/sfs/StreamFileStore"
import { concatArrayBuffers } from "tws-common/lang/arrayBuffer"
import { collectAsyncIterable } from "tws-common/lang/asyncIterator"
import { arrayBufferFromBytes, randomBytesSync } from "tws-common/lang/buffer"
import { iterateOverReader } from "tws-common/lang/readableStream"

const testFileStore = <T extends StreamFileStore>(
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

		const writeSampleFile = async (path: string, data?: ArrayBuffer) => {
			data = data ?? new ArrayBuffer(0)
			const writer = (await fileStore.write(path)).getWriter()
			if (data.byteLength > 0) await writer.write(data)
			await writer.close()
		}

		it.each([
			[[]],
			[[arrayBufferFromBytes([10, 20, 30])]],
			[
				[
					randomBytesSync(10),
					randomBytesSync(10),
					randomBytesSync(10),
					randomBytesSync(10),
				],
			],
			[[randomBytesSync(1024 * 128 + 1), randomBytesSync(1024 * 128)]],
			[
				[
					randomBytesSync(1024 * 128 + 1),
					randomBytesSync(1024 * 88),
					randomBytesSync(1024 * 12),
					randomBytesSync(1024 * 22),
					randomBytesSync(1024 * 91),
				],
			],
		])("can store and read file", async chunks => {
			const data = concatArrayBuffers(...chunks)
			const writer = (await fileStore.write("/asdf.txt")).getWriter()

			for (const c of chunks) {
				await writer.write(c)
			}

			await writer.close()

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

		it("can delete file", async () => {
			await writeSampleFile("/asdf.txt")
			await fileStore.delete("/asdf.txt")

			const res = await fileStore.stat("/asdf.txt")
			expect(res).toStrictEqual(null)
		})

		it.each([
			[[], [], ""],
			[["/asdf.txt"], ["/asdf.txt"], "/"],
			[["/asdf.txt", "/fdsa.txt", "/some/file.txt"], null, "/"],
			[
				["/asdf.txt", "fdsa.txt", "/some/file.txt"],
				["/asdf.txt", "/fdsa.txt", "/some/file.txt"],
				"/",
			],
			[
				[
					"/not-in-dir",
					"/not-in-dir-2",
					"/dir/in-dir",
					"/dir/in-dir-2",
				],
				["/dir/in-dir", "/dir/in-dir-2"],
				"/dir/",
			],
		])("can list files", async (files, expected, prefix) => {
			for (const f of files) {
				await writeSampleFile(f)
			}

			if (!expected) expected = files

			const results = await collectAsyncIterable(fileStore.list(prefix))
			results.sort()
			expected.sort()
			expect(results).toEqual(expected)
		})
	})
}

testFileStore(
	"InMemoryFileStore",
	async () => new InMemoryStreamFileStore(),
	async () => {
		//noop
	},
)

testFileStore(
	"IndexedDBFileStore",
	async () => {
		const db = await FilesDB.open("db1")
		await db.delete()

		return new IndexedDBStreamFileStore(await FilesDB.open("db1"))
	},
	async res => {
		await res.disownFilesDB().close()
	},
)
