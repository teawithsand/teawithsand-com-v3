// Wrapper types for NativeFileSystem API are stored here
// For now for sake of simplicity, not all are defined

type Data = Blob | BufferSource | string

/**
 * Name of any entry in file system.
 */
export type FileSystemEntryName = string & { readonly ty: unique symbol }

export type FileSystemPermissionRequest = {
	mode: "read" | "readwrite"
}
export type FileSystemPermissionResult = "granted" | "denied" | "prompt"

export type FileSystemWritableFileStreamCommand =
	| {
			type: "write"
			position: number
			data: Data
	  }
	| {
			type: "truncate"
			size: number
	  }
	| {
			type: "seek"
			position: number
	  }

export type FileSystemWritableOptions = {
	keepExistingData?: boolean
}

export interface FileSystemWritableFileStream {
	write(command: FileSystemWritableFileStreamCommand): Promise<void>
	seek(position: number): Promise<void>
	truncate(size: number): Promise<void>
}

export interface FileSystemHandle {
	readonly kind: "file" | "directory"
	readonly name: string

	isSameEntry(other: FileSystemHandle): Promise<boolean>
	queryPermission(
		opts: FileSystemPermissionRequest,
	): Promise<FileSystemPermissionResult>
	requestPermission(
		opts: FileSystemPermissionRequest,
	): Promise<FileSystemPermissionResult>
}

export interface FileSystemFileHandle extends FileSystemHandle {
	readonly kind: "file"
	getFile(): Promise<File>
	createWritable(
		options?: FileSystemWritableOptions,
	): Promise<FileSystemWritableFileStream>
}

export interface FileSystemDirectoryHandle extends FileSystemHandle {
	readonly kind: "directory"

	getDirectoryHandle(
		name: FileSystemEntryName,
		options?: FileSystemGetDirectoryOptions,
	): Promise<FileSystemDirectoryHandle>
	getFileHandle(
		name: FileSystemEntryName,
		options?: FileSystemGetFileOptions,
	): Promise<FileSystemFileHandle>
	removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>
	resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>

	entries: () => AsyncIterable<[FileSystemEntryName, FileSystemEntry]>
	keys: () => AsyncIterable<FileSystemEntryName>
	values: () => AsyncIterable<FileSystemEntry>
	[Symbol.asyncIterator]: () => AsyncIterable<
		[FileSystemEntryName, FileSystemEntry]
	>
}
