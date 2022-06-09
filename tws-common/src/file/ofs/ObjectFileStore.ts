export type FileObject = File | Blob

export enum StoredFileObjectKind {
	BLOB = 1,
	FILE = 2,
	FILE_REF = 3,
}

export interface StoredFileObject {
	readonly kind: StoredFileObjectKind
	readonly innerObject: FileObject

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
export default interface ObjectFileStore {
	delete(key: string): Promise<void>
	store(key: string, data: FileObject): Promise<void>
	get(key: string): Promise<StoredFileObject | null>
	iterateKeys(): AsyncIterable<string>
}
