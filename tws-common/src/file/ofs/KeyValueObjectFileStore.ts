import ObjectFileStore, {
	ObjectFileStoreObject,
	PrefixObjectFileStore,
	StoredFileObject,
	StoredFileObjectKind,
} from "tws-common/file/ofs/ObjectFileStore"
import KeyValueStore, {
	PrefixKeyValueStore,
} from "tws-common/keyvalue/KeyValueStore"
import { RWLock, RWLockAdapter } from "tws-common/lang/lock/Lock"
import { SimpleWALHelper, WALStore } from "tws-common/lang/wal"

export type KeyValueObjectFileStoreWALOperation<M> =
	| {
			type: "delete"
			key: string
	  }
	| {
			type: "store"
			metadata: M
			key: string
	  }
	| {
			type: "clear"
	  }

/**
 * Note: this store uses:
 * File API https://developer.mozilla.org/en-US/docs/Web/API/File_API
 * File and Directory Entries API https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API
 * But not File System Access API https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 *
 * Main reason, is that it only works on desktop chrome, which is not main target of app, which this component was designed for.
 */
export default class KeyValueObjectFileStore<M extends {}>
	implements ObjectFileStore<M>, PrefixObjectFileStore<M>
{
	private readonly walHelper: SimpleWALHelper<
		KeyValueObjectFileStoreWALOperation<M>,
		ObjectFileStoreObject | null
	>
	private wasWalSynchronized = false

	private readonly lock: RWLock

	constructor(
		private readonly fileStore: KeyValueStore<ObjectFileStoreObject>,
		private readonly metadataStore: PrefixKeyValueStore<M>,
		private readonly walStore: WALStore<
			KeyValueObjectFileStoreWALOperation<M>
		>,
		lockAdapter: RWLockAdapter,
	) {
		this.lock = new RWLock(lockAdapter)
		this.walHelper = new SimpleWALHelper(
			this.walStore,
			async (data, ctx) => {
				if (data.type === "delete") {
					await this.metadataStore.delete(data.key)
					await this.fileStore.delete(data.key)
				} else if (data.type === "store") {
					if (ctx === null) {
						await this.metadataStore.delete(data.key)
						await this.fileStore.delete(data.key)
					} else {
						await this.metadataStore.set(data.key, data.metadata)
						await this.fileStore.set(data.key, ctx)
					}
				} else if (data.type === "clear") {
					await this.metadataStore.clear()
					await this.fileStore.clear()
				}
			},
		)
	}

	private syncWalIfNeeded = async () => {
		if (this.wasWalSynchronized) {
			return
		}

		await this.walHelper.emptyWalStore(null)
		this.wasWalSynchronized = true
	}

	private runWithLock = async <T>(
		write: boolean,
		op: () => Promise<T>,
	): Promise<T> => {
		if (write || !this.wasWalSynchronized) {
			return await this.lock.withLockWrite(async () => {
				await this.syncWalIfNeeded()
				return await op()
			})
		} else {
			return await this.lock.withLockRead(async () => {
				return await op()
			})
		}
	}

	clear = async (): Promise<void> => {
		await this.runWithLock(true, async () => {
			await this.syncWalIfNeeded()
			await this.walHelper.execute(
				{
					type: "clear",
				},
				null,
			)
		})
	}

	// TODO(teawithsand): add checks to make sure that WAL was initialized properly
	/**
	 * @deprecated Now wal is initialized on first operation performed
	 */
	initializeWAL = async (): Promise<void> => {
		await this.runWithLock(true, async () => {
			// noop
		})
	}

	has = async (key: string): Promise<boolean> =>
		await this.runWithLock(
			false,
			async () => await this.metadataStore.has(key),
		)

	delete = async (key: string): Promise<void> =>
		await this.runWithLock(true, async () => {
			await this.walHelper.execute(
				{
					type: "delete",
					key,
				},
				null,
			)
		})

	setFile = async (
		key: string,
		file: ObjectFileStoreObject,
		metadata: M,
	): Promise<void> => {
		await this.runWithLock(true, async () => {
			await this.walHelper.execute(
				{
					type: "store",
					metadata,
					key,
				},
				file,
			)
		})
	}

	getFile = async (key: string): Promise<StoredFileObject | null> =>
		await this.runWithLock(false, async () => {
			const value = await this.fileStore.get(key)
			if (value === null) return null

			let url: string | null = null

			const kind =
				value instanceof File
					? StoredFileObjectKind.FILE
					: StoredFileObjectKind.BLOB

			return {
				innerObject: value,
				checkPermission: async () => true,
				requestPermission: async () => {
					// noop
				},
				close: () => {
					if (url !== null) {
						URL.revokeObjectURL(url)
						url = null
					}
				},
				obtainURL: async () => {
					if (url !== null) return url
					url = URL.createObjectURL(value)
					return url
				},
				kind,
			}
		})

	getMetadata = async (key: string): Promise<M | null> =>
		await this.runWithLock(false, async () => {
			const metadataStoreResult = this.metadataStore.get(key)
			if (metadataStoreResult) return metadataStoreResult

			return null
		})

	setMetadata = async (key: string, metadata: M): Promise<void> =>
		await this.runWithLock(false, async () => {
			const current = this.metadataStore?.get(key)
			if (!current)
				throw new Error(
					`Key ${key} does not exist in this object store. Store file first.`,
				)
			await this.metadataStore.set(key, metadata)
		})

	keys = (): AsyncIterable<string> => {
		const { metadataStore, runWithLock } = this

		async function* gen() {
			// required, takes care of reading WAL if needed
			const iterator = await runWithLock(false, async () =>
				metadataStore.keys(),
			)
			for await (const v of iterator) {
				yield v
			}
		}
		return gen()
	}

	keysWithPrefix = (prefix: string): AsyncIterable<string> => {
		const { metadataStore, runWithLock } = this

		async function* gen() {
			// required, takes care of reading WAL if needed
			const iterator = await runWithLock(false, async () =>
				metadataStore.keysWithPrefix(prefix),
			)
			for await (const v of iterator) {
				yield v
			}
		}
		return gen()
	}
}
