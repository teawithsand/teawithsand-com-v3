import ObjectFileStore, {
	ObjectFileStoreObject,
	StoredFileObject,
	StoredFileObjectKind,
} from "tws-common/file/ofs/ObjectFileStore"
import KeyValueStore from "tws-common/keyvalue/KeyValueStore"
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

/**
 * Note: this store uses:
 * File API https://developer.mozilla.org/en-US/docs/Web/API/File_API
 * File and Directory Entries API https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API
 * But not File System Access API https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 *
 * Main reason being, is that it only works on desktop chrome, which is not main target of app, which this component was designed for.
 */
export default class KeyValueObjectFileStore<M extends {}>
	implements ObjectFileStore<M>
{
	private readonly walHelper: SimpleWALHelper<
		KeyValueObjectFileStoreWALOperation<M>,
		ObjectFileStoreObject | null
	>

	constructor(
		private readonly fileStore: KeyValueStore<ObjectFileStoreObject>,
		private readonly metadataStore: KeyValueStore<M>,
		private readonly walStore: WALStore<
			KeyValueObjectFileStoreWALOperation<M>
		>,
	) {
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
				}
			},
		)
	}

	initializeWAL = async (): Promise<void> => {
		await this.walHelper.emptyWalStore(null)
	}

	delete = async (key: string): Promise<void> => {
		await this.walHelper.execute(
			{
				type: "delete",
				key,
			},
			null,
		)
	}

	store = async (
		key: string,
		file: ObjectFileStoreObject,
		metadata: M,
	): Promise<void> => {
		await this.walHelper.execute(
			{
				type: "store",
				metadata,
				key,
			},
			file,
		)
	}

	getFile = async (key: string): Promise<StoredFileObject | null> => {
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
	}

	getMetadata = async (key: string): Promise<M | null> => {
		const metadataStoreResult = this.metadataStore.get(key)
		if (metadataStoreResult) return metadataStoreResult

		return null
	}

	setMetadata = async (key: string, metadata: M): Promise<void> => {
		const current = this.metadataStore?.get(key)
		if (!current)
			throw new Error(
				`Key ${key} does not exist in this object store. Store file first.`,
			)
		await this.metadataStore.set(key, metadata)
	}

	keys = (): AsyncIterable<string> => {
		return this.fileStore.keys()
	}
}
