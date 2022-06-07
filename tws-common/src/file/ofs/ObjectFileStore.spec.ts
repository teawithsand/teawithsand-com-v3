import KeyValueObjectFileStore from "tws-common/file/ofs/KeyValueObjectFileStore"
import ObjectFileStore from "tws-common/file/ofs/ObjectFileStore"
import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"
import { arrayBufferFromBytes } from "tws-common/lang/buffer"

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
