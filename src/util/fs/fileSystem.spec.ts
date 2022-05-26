import { FileEntry, FileSystemEntryKind, FS_CREATE, FS_READ, FS_WRITE } from "@app/util/fs/FileSystem";
import InMemoryFileSystem from "@app/util/fs/InMemoryFileSystem";
import { collectAsyncIterable } from "@app/util/lang/asyncIterator";
import { arrayBufferFromBytes } from "@app/util/lang/buffer";


describe("InMemoryFileSystem", () => {
	let fs: InMemoryFileSystem

	beforeEach(() => {
		fs = new InMemoryFileSystem()
	})

	it("can read and write file", async () => {
		const wf = await fs.open("/asdf.txt", FS_WRITE | FS_CREATE)
        const data = arrayBufferFromBytes([0, 1, 2, 3, 4])
		try {
			await wf.write(data)
		} finally {
			await wf.close()
		}

		const rf = await fs.open("/asdf.txt", FS_READ)
		try {
            const b = new ArrayBuffer(100)
            const sz = await rf.read(b)
            expect(b.slice(sz)).toEqual(data)
		} finally {
			await rf.close()
		}
	})

	describe("dir ops", () => {
		it("can list parent dir", async () => {
			const entries = await collectAsyncIterable(fs.list("/"))
			expect(entries).toEqual([])
		})
		it("can list parent dir with entries", async () => {
			const fs = new InMemoryFileSystem()
			const f = await fs.open("/asdf.txt", FS_WRITE | FS_CREATE)
			await f.close()

			const entries = await collectAsyncIterable(fs.list("/"))
			expect(entries).toEqual([
				{
					kind: FileSystemEntryKind.File,
					name: "asdf.txt",
					path: "/asdf.txt",
					size: 0,
				},
			] as FileEntry[])
		})
	})
})