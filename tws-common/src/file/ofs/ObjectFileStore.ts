export type ObjectFileStoreObject = File | Blob

export enum StoredFileObjectKind {
	BLOB = 1,
	FILE = 2,
	FILE_REF = 3,
}

export interface StoredFileObject {
	readonly kind: StoredFileObjectKind
	readonly innerObject: ObjectFileStoreObject

	// These two are used if we store reference to file
	requestPermission(): Promise<void>
	checkPermission(): Promise<boolean>

	/**
	 * Obtains URL to object.
	 * This URL is valid until close method of this object is called.
	 */
	obtainURL(): Promise<string>

	/**
	 * Releases all resources associated with this object.
	 */
	close(): void
}

/**
 * Store, capable of storing some objects(for now blobs and files), which then resolve to URLs.
 *
 * Note: for now this store is not capable of storing directory references. Each directory has to be flattened to set of files.
 */
export default interface ObjectFileStore<M extends {}> {
	delete(key: string): Promise<void>
	has(key: string): Promise<boolean>

	setFile(
		key: string,
		data: ObjectFileStoreObject,
		metadata: M,
	): Promise<void>
	getFile(key: string): Promise<StoredFileObject | null>

	getMetadata(key: string): Promise<M | null>
	setMetadata(key: string, metadata: M): Promise<void>

	keys(): AsyncIterable<string>
}

export interface PrefixObjectFileStore<M extends {}>
	extends ObjectFileStore<M> {
	keyWithPrefix(prefix: string): AsyncIterable<string>
}

// TODO(teawithsand): implement mutating/prefixing OFS, just like key value one