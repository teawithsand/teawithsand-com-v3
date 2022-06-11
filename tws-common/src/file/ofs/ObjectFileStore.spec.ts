import KeyValueObjectFileStore from "tws-common/file/ofs/KeyValueObjectFileStore";
import ObjectFileStore from "tws-common/file/ofs/ObjectFileStore";
import InMemoryKeyValueStore from "tws-common/keyvalue/InMemoryKeyValueStore";
import { arrayBufferFromBytes } from "tws-common/lang/buffer";
import KeyValueWALStore from "tws-common/lang/wal/KeyValueWALStore";


describe("KeyValueObjectFileStore", () => {
	let store: ObjectFileStore<{
		meaning: string
	}>
	beforeEach(() => {
		store = new KeyValueObjectFileStore(
			new InMemoryKeyValueStore(),
			new InMemoryKeyValueStore(),
			new KeyValueWALStore(new InMemoryKeyValueStore()),
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

	it("can update metadata", async () => {
		const blob = new Blob([arrayBufferFromBytes([123])])

		await store.setFile("/asdf", blob, {
			meaning: "of life",
		})
		
		await store.setMetadata("/asdf", {
			meaning: "of being",
		})

		expect((await store.getMetadata("/asdf"))?.meaning).toStrictEqual("of being")
	})
})