import { LOCALSTORAGE } from "localforage"
import KeyValueStore, {
	PrefixKeyValueStore,
} from "tws-common/keyvalue/KeyValueStore"
import localforage, { INDEXEDDB } from "tws-common/keyvalue/localforage"

// TODO(teawithsand): in future for better performance port
// https://github.com/localForage/localForage-startsWith/tree/master/lib/implementations
// For prefix queries into my codebase, since that project looks unmaintained

export default class LocalForageKeyValueStore<
	V extends {},
	K extends string = string,
> implements KeyValueStore<V, K>, PrefixKeyValueStore<V, K>
{
	constructor(private readonly forage: LocalForage) {}

	/**
	 * Creates simple store using IndexedDB.
	 */
	static readonly simpleIDB = <V extends {}>(name: string, version = 1) => {
		return new LocalForageKeyValueStore<V>(
			localforage.createInstance({
				driver: [INDEXEDDB],
				name,
				storeName: name,
				description: `Store ${name} - simple one(using IDB)`,
				version,
			}),
		)
	}

	/**
	 * @deprecated use simpleIDB instead
	 */
	static readonly simple = LocalForageKeyValueStore.simpleIDB

	/**
	 * This one should be preferred to simple one, when low latency is needed along with persistence
	 * and amount of data is small(typical usage for WAL for instance).
	 */
	static readonly simpleLocalStorage = <V extends {}>(
		name: string,
		version = 1,
	) => {
		return new LocalForageKeyValueStore<V>(
			localforage.createInstance({
				driver: [LOCALSTORAGE],
				name,
				storeName: name,
				description: `Store ${name} - simple one(using local storage)`,
				version,
			}),
		)
	}

	delete = async (id: K): Promise<void> => {
		await this.forage.removeItem(id)
	}

	has = async (id: K): Promise<boolean> =>
		(await this.forage.getItem(id)) !== null

	get = async (id: K): Promise<V | null> => {
		const res = await this.forage.getItem(id)
		return res as V | null
	}

	set = async (id: K, value: V): Promise<void> => {
		await this.forage.setItem(id, value)
	}

	clear = async (): Promise<void> => {
		await this.forage.clear()
	}

	keys = (): AsyncIterable<K> => {
		const { forage } = this
		async function* gen() {
			const keys = await forage.keys()
			for (const k of keys) {
				yield k as K
			}
		}

		return gen()
	}

	keysWithPrefix = (prefix: string): AsyncIterable<K> => {
		const { forage } = this
		async function* gen() {
			const keys = await forage.keysStartingWith(prefix)
			for (const k of keys) {
				yield k as K
			}
		}
		return gen()
	}
}
