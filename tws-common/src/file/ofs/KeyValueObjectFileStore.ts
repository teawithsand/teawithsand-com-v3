import ObjectFileStore, {
	StoredFileObject,
	StoredFileObjectKind,
} from "tws-common/file/ofs/ObjectFileStore"
import KeyValueStore from "tws-common/keyvalue/KeyValueStore"

type Value = Blob | File

/**
 * Note: this store uses:
 * File API https://developer.mozilla.org/en-US/docs/Web/API/File_API
 * File and Directory Entries API https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API
 * But not File System Access API https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 * 
 * Main reason being, is that it only works on desktop chrome, which is not main target of app, which this component was designed for.
 */
export default class KeyValueObjectFileStore implements ObjectFileStore {
	constructor(private readonly innerStore: KeyValueStore<Value>) {}

	delete = async (key: string): Promise<void> => {
		await this.innerStore.delete(key)
	}

	store = async (key: string, data: Value): Promise<void> => {
		await this.innerStore.set(key, data)
	}

	get = async (key: string): Promise<StoredFileObject | null> => {
		const value = await this.innerStore.get(key)
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

	iterateKeys = (): AsyncIterable<string> => {
		return this.innerStore.iterateKeys()
	}
}
