export const FS_READ = 0b1
export const FS_WRITE = 0b1 << 1
export const FS_RDWR = FS_READ | FS_WRITE
export const FS_APPEND = 0b1 << 2
export const FS_CREATE = 0b1 << 3
export const FS_EXCL = 0b1 << 4
export const FS_SYNC = 0b1 << 5 // reserved for usage with future file systems
export const FS_TRUNC = 0b1 << 6

/**
 * File system mode created from flags.
 */
export type FileSystemOpenFlags = number

export enum FileSeekMode {
	SeekSet = 1,
	SeekBy = 2,
	SeekEnd = 3,
}

export enum FileSystemEntryKind {
	File = 1,
	Dir = 2,
	Symlink = 3,
	Mount = 4,
}

export interface File {
	read(buf: ArrayBufferLike): Promise<number>
	write(buf: ArrayBufferLike): Promise<number>
	position(): Promise<number> // AKA ftell
	seek(to: number, pos: FileSeekMode): Promise<void>
	flush(): Promise<void>
	close(): Promise<void>
}

export interface FileEntry {
	name: string
	path: string
	kind: FileSystemEntryKind
	size: number
}

export default interface FileSystem<F extends File = File> {
	list(path: string): AsyncIterable<FileEntry>
	open(path: string, flags: FileSystemOpenFlags): Promise<F>

	mkdir(path: string): Promise<void>
	rmdir(path: string): Promise<void>
	
	unlink(path: string): Promise<void>
}
