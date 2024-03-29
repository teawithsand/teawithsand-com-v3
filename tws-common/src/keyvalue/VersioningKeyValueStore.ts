import KeyValueStore, {
	PrefixKeyValueStore,
} from "tws-common/keyvalue/KeyValueStore"

// TODO(teawithsand): make it support non-string keys and non-prefix stores

/**
 * Value, which supports versioning using numbers.
 * Useful when creating union of different versions of some value.
 */
export interface NumberVersionedValue<T, V extends number> {
	version: V
	value: T
}

/**
 * Value, which supports versioning using strings.
 * Useful when creating union of different versions of some value.
 */
export interface StringVersionedValue<T, V extends string> {
	version: V
	value: T
}

export interface VersioningKeyValueStoreAdapter<
	IV extends {}, // Type of previous value
	OV extends {}, // Type of new value
> {
	// Required, for support of objects when pre-versioning KV store was used
	addVersioningData(v: OV): IV
	extractValue(v: IV): OV
}

/**
 * Store, which is capable of taking values of inner type and converting them to outer type.
 */
export class VersioningKeyValueStore<
	IV extends {},
	OV extends {},
	K extends string = string,
> implements KeyValueStore<OV, K>, PrefixKeyValueStore<OV, K>
{
	constructor(
		private readonly inner: PrefixKeyValueStore<IV, K>,
		private readonly adapter: VersioningKeyValueStoreAdapter<IV, OV>,
	) {}

	get = async (id: K): Promise<OV | null> => {
		const v = await this.inner.get(id)
		if (v !== null) return this.adapter.extractValue(v)
		return null
	}
	set = async (id: K, value: OV): Promise<void> =>
		await this.inner.set(id, this.adapter.addVersioningData(value))
	has = async (key: K) => await this.inner.has(key)
	delete = async (key: K) => await this.inner.delete(key)
	clear = async () => await this.inner.clear()
	keys = () => this.inner.keys()
	keysWithPrefix = (prefix: string) => this.inner.keysWithPrefix(prefix)
}

export default VersioningKeyValueStore
