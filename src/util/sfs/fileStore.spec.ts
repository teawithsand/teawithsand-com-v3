import { collectAsyncIterable } from "@app/util/lang/asyncIterator"
import { arrayBufferFromBytes } from "@app/util/lang/buffer"
import FileStore, { WriteMode } from "@app/util/sfs/FileStore"
import InMemoryFileStore from "@app/util/sfs/InMemoryFileStore"

describe("InMemoryFileStore", () => {
	let fs: FileStore

	beforeEach(() => {
		fs = new InMemoryFileStore()
	})

	it("can read and write file", async () => {
		const wf = await fs.openForWriting("/asdf.txt", WriteMode.Override)
		const data = arrayBufferFromBytes([0, 1, 2, 3, 4])
		try {
			await wf.write(data)
		} finally {
			await wf.close()
		}

		const rf = await fs.openForReading("/asdf.txt")
		try {
			const b = new ArrayBuffer(100)
			const sz = await rf.readToBuffer(b)
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
			let f = await fs.openForWriting("/asdf.txt", WriteMode.Override)
			await f.close()

			f = await fs.openForWriting("/fdsa.txt", WriteMode.Override)
			await f.close()

			f = await fs.openForWriting("/some/asdf.txt", WriteMode.Override)
			await f.close()

			const entries = await collectAsyncIterable(fs.list("/"))
			expect(entries).toEqual([
				"/asdf.txt",
				"/fdsa.txt",
				"/some/asdf.txt",
			])
		})

		it("can list with prefix", async () => {
			let f = await fs.openForWriting("/asdf.txt", WriteMode.Override)
			await f.close()

			f = await fs.openForWriting("/fdsa.txt", WriteMode.Override)
			await f.close()

			f = await fs.openForWriting("/some/asdf.txt", WriteMode.Override)
			await f.close()

			const entries = await collectAsyncIterable(fs.list("/some"))
			expect(entries).toEqual(["/some/asdf.txt"])
		})
	})
})
