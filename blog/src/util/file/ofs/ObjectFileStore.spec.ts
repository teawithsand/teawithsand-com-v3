import KeyValueObjectFileStore from "@app/util/file/ofs/KeyValueObjectFileStore"
import ObjectFileStore from "@app/util/file/ofs/ObjectFileStore"
import LocalForageKeyValueStore from "@app/util/keyvalue/LocalForageKeyValueStore"
import { arrayBufferFromBytes } from "@app/util/lang/buffer"

describe("KeyValueObjectFileStore", () => {
	let store: ObjectFileStore
	beforeEach(() => {
		const kv = LocalForageKeyValueStore.simple<Blob | File>("test")
		store = new KeyValueObjectFileStore(kv)
	})

	it("can store blob", async () => {
		const blob = new Blob([arrayBufferFromBytes([123])])

		await store.store("/asdf", blob)
		const res = await store.get("/asdf")
		expect(res?.innerObject).toEqual(blob)
	})
})
