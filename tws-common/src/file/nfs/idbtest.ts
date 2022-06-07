import { getIndexedDBFileSystem } from "tws-common/file/nfs/idb"

describe("IDBFileSystem", () => {
	let fs: FileSystemHandle

	beforeEach(async () => {
		fs = await getIndexedDBFileSystem("fs")
	})
	afterEach(() => {
		const p = new Promise((resolve, reject) => {
			const evt = indexedDB.deleteDatabase("fs")
			evt.onsuccess = resolve
			evt.onerror = reject
		})
	})

	it("can obtain fs", () => {})
	// TODO(teawithsand): testing for new idb fs
})
