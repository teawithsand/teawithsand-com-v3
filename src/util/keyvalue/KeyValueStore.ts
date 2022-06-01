export default interface KeyValueStore<V, K = string> {
	get(id: K): Promise<V | null>
	set(id: K, value: V): Promise<void>
	clear(): Promise<void>
	iterateKeys(): AsyncIterable<K>
}
