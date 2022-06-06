import KeyValueStore from "@app/util/keyvalue/KeyValueStore"

export default class LocalForageKeyValueStore<V, K extends string = string>
	implements KeyValueStore<V, K>
{
	constructor(private readonly forage: LocalForage) {}

	delete = async (id: K): Promise<void> => {
		await this.forage.removeItem(id)
	}

	get = async (id: K): Promise<V | null> => {
		const res = await this.forage.getItem(id)
		return res as V | null
	}
	
	set = async (id: K, value: V) => {
		await this.forage.setItem(id, value)
	}

	clear = async (): Promise<void> => {
		await this.forage.clear()
	}

	iterateKeys = (): AsyncIterable<K> => {
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
