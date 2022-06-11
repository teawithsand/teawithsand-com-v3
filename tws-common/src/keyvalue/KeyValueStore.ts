export default interface KeyValueStore<V, K = string> {
	get(id: K): Promise<V | null>
	set(id: K, value: V): Promise<void>
	has(id: K): Promise<boolean>

	delete(id: K): Promise<void>

	/**
	 * Note: unlike other mutating operations, this one is not atomic.
	 * It may end up clearing only some part of entries.
	 */
	clear(): Promise<void>

	keys(): AsyncIterable<K>
}

export interface PrefixKeyValueStore<V, K extends string = string>
	extends KeyValueStore<V, K> {
	keysWithPrefix(prefix: string): AsyncIterable<K>
}
