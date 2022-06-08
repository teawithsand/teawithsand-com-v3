import {
	FileSystemDirectoryHandle,
	FileSystemEntryName,
} from "tws-common/file/nfs"
import { createInMemoryFileSystem } from "tws-common/file/nfs/memory"
import { collectAsyncIterable } from "tws-common/lang/asyncIterator"
import { promiseHasThrown } from "tws-common/lang/promise"

const doTest = <T extends FileSystemDirectoryHandle>(
	name: string,
	fsFactory: () => Promise<T>,
	cleaner: (store: T) => Promise<void>,
) => {
	describe(name, () => {
		let store: T

		beforeEach(async () => {
			store = await fsFactory()
		})
		afterAll(async () => {
			await cleaner(store)
		})

		describe("get dir", () => {
			it("throws when not found", async () => {
				expect(
					await promiseHasThrown(
						store.getDirectoryHandle(
							"not-exist" as FileSystemEntryName,
						),
					),
				).toStrictEqual(true)
			})
			it("creates when not found and flag set", async () => {
				const dir = await store.getDirectoryHandle(
					"not-exist" as FileSystemEntryName,
					{
						create: true,
					},
				)

                expect(await collectAsyncIterable(dir.entries())).toEqual([])
			})
		})
	})
}

doTest(
	"InMemory",
	async () => createInMemoryFileSystem(),
	async () => {
		// noop; it's in memory
	},
)
