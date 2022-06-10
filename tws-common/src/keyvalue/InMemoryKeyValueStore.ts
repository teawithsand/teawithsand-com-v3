import KeyValueStore from "tws-common/keyvalue/KeyValueStore"

export default class InMemoryKeyValueStore<V, K extends string = string>
	implements KeyValueStore<V, K>
{
	constructor(private readonly map: Map<K, V> = new Map()) {}
	get = (id: K): Promise<V | null> =>
		Promise.resolve(this.map.get(id) ?? null)
        
	set = (id: K, value: V): Promise<void> => {
		this.map.set(id, value)
		return Promise.resolve()
	}

	delete = (id: K): Promise<void> => {
		this.map.delete(id)
		return Promise.resolve()
	}

	clear = (): Promise<void> => {
		this.map.clear()
		return Promise.resolve()
	}

	iterateKeys = (): AsyncIterable<K> => {
		const keys = this.map.keys()
		async function* gen() {
			for (const k of keys) {
				yield k
			}
		}

		return gen()
	}
}
