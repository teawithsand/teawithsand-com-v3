import KeyValueObjectFileStore from "tws-common/file/ofs/KeyValueObjectFileStore"
import ObjectFileStore from "tws-common/file/ofs/ObjectFileStore"
import InMemoryKeyValueStore from "tws-common/keyvalue/InMemoryKeyValueStore"
import { arrayBufferFromBytes } from "tws-common/lang/buffer"
import { FakeRWLockAdapter } from "tws-common/lang/lock/Lock"
import { MutexLockAdapter } from "tws-common/lang/lock/MutexLockAdapter"
import KeyValueWALStore from "tws-common/lang/wal/KeyValueWALStore"

describe("KeyValueObjectFileStore", () => {
	let store: ObjectFileStore<{
		meaning: string
	}>
	beforeEach(() => {
		store = new KeyValueObjectFileStore(
			new InMemoryKeyValueStore(),
			new InMemoryKeyValueStore(),
			new KeyValueWALStore(new InMemoryKeyValueStore()),
			new FakeRWLockAdapter(new MutexLockAdapter()),
		)
	})

	it("can store entry", async () => {
		const blob = new Blob([arrayBufferFromBytes([123])])

		await store.setFile("/asdf", blob, {
			meaning: "of life",
		})
		const file = await store.getFile("/asdf")
		expect(file?.innerObject).toEqual(blob)
		const metadata = await store.getMetadata("/asdf")
		expect(metadata?.meaning).toStrictEqual("of life")
	})

	it("can delete entry", async () => {
		await store.setFile("/asdf", new File([], "asdf.txt"), {
			meaning: "of life",
		})

		await store.delete("/asdf")

		const metadata = await store.getMetadata("/asdf")
		expect(metadata).toBeNull()

		const file = await store.getFile("/asdf")
		expect(file).toBeNull()
	})

	it("can update metadata", async () => {
		const blob = new Blob([arrayBufferFromBytes([123])])

		await store.setFile("/asdf", blob, {
			meaning: "of life",
		})

		await store.setMetadata("/asdf", {
			meaning: "of being",
		})

		expect((await store.getMetadata("/asdf"))?.meaning).toStrictEqual(
			"of being",
		)
	})
})
