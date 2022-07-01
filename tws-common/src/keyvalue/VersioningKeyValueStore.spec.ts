import InMemoryKeyValueStore from "tws-common/keyvalue/InMemoryKeyValueStore"
import { PrefixKeyValueStore } from "tws-common/keyvalue/KeyValueStore"
import VersioningKeyValueStore, {
	NumberVersionedValue,
} from "tws-common/keyvalue/VersioningKeyValueStore"

type InitValue = {
	text: string
}

type ValueV2 = {
	otherText: string
}

type VersionedInnerValue = NumberVersionedValue<ValueV2, 2>

type InnerValue = InitValue | VersionedInnerValue

type LatestValue = ValueV2

describe("VersioningKeyValueStore", () => {
	let innerStore: PrefixKeyValueStore<InnerValue>
	let versioningStore: VersioningKeyValueStore<InnerValue, LatestValue>
	beforeEach(() => {
		innerStore = new InMemoryKeyValueStore()
		versioningStore = new VersioningKeyValueStore(innerStore, {
			addVersioningData: v => ({
				version: 2,
				value: v,
			}),
			extractValue: v => {
				if ((v as any).version === undefined) {
					const typed = v as InitValue

					return {
						otherText: typed.text,
					}
				}

				const typed = v as VersionedInnerValue

				switch (typed.version) {
					case 2:
						return typed.value
					default:
						throw new Error(
							`Unknown value version ${typed.version}`,
						)
				}
			},
		})
	})

	it("can upgrade not-versioned value store", async () => {
		await innerStore.set("asdf", {
			text: "fdsa",
		})

		const v = await versioningStore.get("asdf")
		expect(v).toEqual({
			otherText: "fdsa",
		})
	})
})
