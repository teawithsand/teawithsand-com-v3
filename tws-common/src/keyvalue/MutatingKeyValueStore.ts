import KeyValueStore, {
	PrefixKeyValueStore,
} from "tws-common/keyvalue/KeyValueStore"
import { collectAsyncIterable } from "tws-common/lang/asyncIterator"

// TODO(teawithsand): make it support non-string keys and non-prefix stores

/**
 * Store, which mutates each key before passing it down to inner one.
 */
export default class MutatingKeyValueStore<V extends {}, E extends {}>
	implements KeyValueStore<V, string>, PrefixKeyValueStore<V, string>
{
	constructor(
		private readonly mutator: {
			mutateKey: (k: string) => Promise<string>
			mutateKeyReverse: (k: string) => Promise<string>
			mutatePrefix: (k: string) => Promise<string>
			mutateValue: (innerValue: E) => Promise<V>
			mutateValueReverse: (outerValue: V) => Promise<E>
		},
		private readonly inner: PrefixKeyValueStore<E, string>,
	) {}

	private readonly mutateKeyReverse = this.mutator.mutateKeyReverse
	private readonly mutateKey = this.mutator.mutateKey
	private readonly mutatePrefix = this.mutator.mutatePrefix
	private readonly mutateValue = this.mutator.mutateValue
	private readonly mutateValueReverse = this.mutator.mutateValueReverse

	get = async (id: string): Promise<V | null> => {
		const v = await this.inner.get(await this.mutateKey(id))
		if (v !== null) this.mutateValue(v)
		return null
	}
	set = async (id: string, value: V): Promise<void> =>
		await this.inner.set(
			await this.mutateKey(id),
			await this.mutateValueReverse(value),
		)
	has = async (id: string): Promise<boolean> =>
		await this.inner.has(await this.mutateKey(id))
	delete = async (id: string): Promise<void> =>
		await this.inner.delete(await this.mutateKey(id))

	// TODO(teawithsand): make this atomic, which should be doable with
	// localforage extensions available on it's github
	// well, at least for IDB and WebSQL drivers
	clear = async (): Promise<void> => {
		const keys = await collectAsyncIterable(this.keys())

		for (const k of keys) {
			await this.delete(k)
		}
	}

	keys = (): AsyncIterable<string> => this.keysWithPrefix("")
	keysWithPrefix = (prefix: string): AsyncIterable<string> => {
		const { inner, mutatePrefix, mutateKeyReverse } = this
		async function* gen() {
			const keys = inner.keysWithPrefix(await mutatePrefix(prefix))

			for await (const k of keys) {
				yield mutateKeyReverse(k)
			}
		}
		return gen()
	}
}
