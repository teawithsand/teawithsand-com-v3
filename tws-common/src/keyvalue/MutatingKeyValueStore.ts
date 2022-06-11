import KeyValueStore, {
	PrefixKeyValueStore,
} from "tws-common/keyvalue/KeyValueStore"
import { collectAsyncIterable } from "tws-common/lang/asyncIterator"

/**
 * Store, which mutates each key before passing it down to inner one.
 */
export default class MutatingKeyValueStore<V>
	implements KeyValueStore<V, string>, PrefixKeyValueStore<V, string>
{
	private constructor(
		private readonly mutator: {
			mutateKey: (k: string) => string
			mutatePrefix?: (k: string) => string
		},
		private readonly inner: PrefixKeyValueStore<V, string>,
	) {}

	private mutateKey = this.mutator.mutateKey
	private mutatePrefix = this.mutator.mutatePrefix ?? this.mutator.mutateKey

	get = (id: string): Promise<V | null> => this.inner.get(this.mutateKey(id))
	set = (id: string, value: V): Promise<void> =>
		this.inner.set(this.mutateKey(id), value)
	has = (id: string): Promise<boolean> => this.inner.has(this.mutateKey(id))
	delete = (id: string): Promise<void> =>
		this.inner.delete(this.mutateKey(id))

	// TODO(teawithsand): make this atomic, which should be doable with
	// localforage extensions available on it's github
	// well, at least for IDB and WebSQL drivers
	clear = async (): Promise<void> => {
		const keys = await collectAsyncIterable(this.keys())

		for (const k of keys) {
			await this.delete(k)
		}
	}

	keys = (): AsyncIterable<string> =>
		this.inner.keysWithPrefix(this.mutatePrefix(""))
	keysWithPrefix = (prefix: string): AsyncIterable<string> =>
		this.inner.keysWithPrefix(this.mutatePrefix(prefix))
}
