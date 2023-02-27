import ObjectFileStore, {
	ObjectFileStoreObject,
	PrefixObjectFileStore,
	StoredFileObject,
} from "tws-common/file/ofs/ObjectFileStore"
import { collectAsyncIterable } from "tws-common/lang/asyncIterator"

export default class MutatingObjectFileStore<M extends {}, E extends {}>
	implements ObjectFileStore<M>, PrefixObjectFileStore<M>
{
	constructor(
		private readonly mutator: {
			mutateKeyReverse: (k: string) => Promise<string>
			mutateKey: (k: string) => Promise<string>
			mutatePrefix: (k: string) => Promise<string>
			mutateValue: (innerValue: E) => Promise<M>
			mutateValueReverse: (outerValue: M) => Promise<E>
		},
		private readonly inner: PrefixObjectFileStore<E>,
	) {}

	private readonly mutateKey = this.mutator.mutateKey
	private readonly mutateKeyReverse = this.mutator.mutateKeyReverse
	private readonly mutatePrefix = this.mutator.mutatePrefix
	private readonly mutateValue = this.mutator.mutateValue
	private readonly mutateValueReverse = this.mutator.mutateValueReverse

	delete = async (key: string): Promise<void> => {
		await this.inner.delete(await this.mutateKey(key))
	}

	has = async (key: string): Promise<boolean> =>
		await this.inner.has(await this.mutateKey(key))

	setFile = async (
		key: string,
		data: ObjectFileStoreObject,
		metadata: M,
	): Promise<void> => {
		await this.inner.setFile(
			await this.mutateKey(key),
			data,
			await this.mutateValueReverse(metadata),
		)
	}

	getFile = async (key: string): Promise<StoredFileObject | null> => {
		return await this.inner.getFile(await this.mutateKey(key))
	}

	getMetadata = async (key: string): Promise<M | null> => {
		const m = await this.inner.getMetadata(await this.mutateKey(key))
		if (m !== null) return this.mutateValue(m)
		return null
	}

	setMetadata = async (key: string, metadata: M): Promise<void> => {
		await this.inner.setMetadata(
			await this.mutateKey(key),
			await this.mutateValueReverse(metadata),
		)
	}

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
