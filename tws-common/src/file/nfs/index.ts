// Wrapper types for NativeFileSystem API are stored here
// For now for sake of simplicity, not all are defined

type Data = Blob | BufferSource | string

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

// Only not-predefined by ts environment types are defined here
/*
export interface FileSystemHandle {
	readonly kind: "file" | "directory"
	readonly name: string

	isSameEntry(other: FileSystemHandle): boolean
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

    getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>;
    getFileHandle(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle>;
    removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>;
    resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>;
}
*/
