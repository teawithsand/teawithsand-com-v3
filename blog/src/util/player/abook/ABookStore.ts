import KeyValueStore from "@app/util/keyvalue/KeyValueStore"
import LocalForageKeyValueStore from "@app/util/keyvalue/LocalForageKeyValueStore"
import ABook from "@app/util/player/abook/ABook"

class ABookStore implements KeyValueStore<ABook> {
	private constructor(private readonly inner: KeyValueStore<ABook, string>) {}
	get = this.inner.get
	set = this.inner.set
	clear = this.inner.clear
	iterateKeys = this.inner.iterateKeys
	delete = this.inner.delete

	// In future more functions may be included here
	// like lookup book by name

	// private static upgradeEntry = (entry: Record<string, never>): ABook => {}

	static createGlobalInstance = (): ABookStore => {
		return new ABookStore(LocalForageKeyValueStore.simple("abookMetadata"))
	}
}

export const ABOOK_STORE = ABookStore.createGlobalInstance()
