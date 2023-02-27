import {
	FileSystemDirectoryHandle,
	FileSystemEntryName,
} from "tws-common/file/nfs"
import { createKeyValueNativeFileSystem } from "tws-common/file/nfs/kv"
import { createInMemoryFileSystem } from "tws-common/file/nfs/memory"
import InMemoryKeyValueStore from "tws-common/keyvalue/InMemoryKeyValueStore"
import { collectAsyncIterable } from "tws-common/lang/asyncIterator"
import { isPromiseHasThrown } from "tws-common/lang/promise"

const doTest = <T extends FileSystemDirectoryHandle>(
	name: string,
	fsFactory: () => Promise<T>,
	cleaner: (store: T) => Promise<void>,
) => {
	describe(name, () => {
		let store: T

		const writeFile = async (
			entry: FileSystemDirectoryHandle,
			name: string,
			data: string,
			create = true,
		) => {
			const handle = await entry.getFileHandle(name, { create })
			const wr = await handle.createWritable()
			await wr.write({
				type: "write",
				data,
				position: 0,
			})
			await wr.close()
		}

		const readFile = async (
			entry: FileSystemDirectoryHandle,
			name: string,
		): Promise<string> => {
			const handle = await entry.getFileHandle(name, { create: true })
			const file = await handle.getFile()
			const blob = file.slice(0)

			// looks like JSDOM does not like blob's text method
			return await new Promise<string>((resolve, reject) => {
				const fr = new FileReader()
				fr.onload = () => resolve(fr.result as any)
				fr.onerror = reject
				fr.readAsText(blob)
			})
		}

		beforeEach(async () => {
			store = await fsFactory()
		})
		afterAll(async () => {
			await cleaner(store)
		})

		describe("getDirectoryHandle", () => {
			it("throws when not found", async () => {
				expect(
					await isPromiseHasThrown(
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

			it("does not recreate when found and flag set", async () => {
				const existing_handle = await store.getDirectoryHandle("dir", {
					create: true,
				})
				await existing_handle.getFileHandle("file", { create: true })
				const dir = await store.getDirectoryHandle("dir", {
					create: true,
				})

				expect(await collectAsyncIterable(dir.keys())).toEqual(["file"])
			})

			it("throws when trying to open file", async () => {
				const f1 = await store.getFileHandle("file", { create: true })
				expect(
					await isPromiseHasThrown(store.getDirectoryHandle("file")),
				).toBe(true)
				expect(
					await isPromiseHasThrown(
						store.getDirectoryHandle("file", { create: true }),
					),
				).toBe(true)

				const f2 = await store.getFileHandle("file")
				expect(await f1.isSameEntry(f2)).toBe(true)
			})

			it.each([[""], ["."], [".."]])(
				"throws when using invalid name",
				async name => {
					expect(
						await isPromiseHasThrown(
							store.getDirectoryHandle(name),
						),
					).toBe(true)
					expect(
						await isPromiseHasThrown(
							store.getDirectoryHandle(name, { create: true }),
						),
					).toBe(true)

					expect(
						await isPromiseHasThrown(store.getFileHandle(name)),
					).toBe(true)
					expect(
						await isPromiseHasThrown(
							store.getFileHandle(name, { create: true }),
						),
					).toBe(true)
				},
			)
		})

		describe("getFileHandle", () => {
			it("can write file", async () => {
				const data = "text"
				await writeFile(store, "asdf.txt", data)
				const res = await readFile(store, "asdf.txt")

				expect(res).toStrictEqual(data)
			})

			it("getFileHandle with create false does not create file and throws", async () => {
				expect(
					await isPromiseHasThrown(store.getFileHandle("file")),
				).toBe(true)
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

doTest(
	"keyValue",
	async () =>
		createKeyValueNativeFileSystem({
			entries: new InMemoryKeyValueStore(),
			wal: new InMemoryKeyValueStore(),
		}),
	async () => {
		// noop; it's in memory
	},
)
