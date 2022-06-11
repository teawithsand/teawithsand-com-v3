import localforage, { INDEXEDDB } from "localforage"
import KeyValueStore from "tws-common/keyvalue/KeyValueStore"

// TODO(teawithsand): in future for better performance port
// https://github.com/localForage/localForage-startsWith/tree/master/lib/implementations
// For prefix queries into my codebase, since that project looks unmaintained

export default class LocalForageKeyValueStore<V, K extends string = string>
	implements KeyValueStore<V, K>
{
	constructor(private readonly forage: LocalForage) {}

	static readonly simple = <V>(name: string) => {
		return new LocalForageKeyValueStore<V>(
			localforage.createInstance({
				driver: [INDEXEDDB],
				name,
				storeName: name,
				description: `Store ${name} - simple one`,
				version: 1,
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
}
