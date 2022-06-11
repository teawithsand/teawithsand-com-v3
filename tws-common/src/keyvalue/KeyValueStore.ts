export default interface KeyValueStore<V, K = string> {
	get(id: K): Promise<V | null>
	set(id: K, value: V): Promise<void>
	has(id: K): Promise<boolean>

	delete(id: K): Promise<void>
	clear(): Promise<void>

	keys(): AsyncIterable<K>
}
