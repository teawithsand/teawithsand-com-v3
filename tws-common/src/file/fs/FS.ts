import File from "tws-common/file/fs/File"
import { FileInfo } from "tws-common/file/sfs/StreamFileStore"

export interface FileSystemOps {
	/**
	 * Renames fs entry from one path to new one
	 */
	rename(from: string, to: string): Promise<void>

	/**
	 * Like linux's stat or lstat syscall.
	 * Returns file info or null, if path does not exist.
	 */
	stat(path: string): Promise<FileInfo | null>
}

export type FileSystemInfo = {
	supportsSymlinks: boolean
	supportsFlush: boolean
	readOnly: boolean
}

export enum OpenFileMode {
	READ = 1,
	WRITE = 2,
	READWRITE = 3,
}

export type OpenFileOptions = {
	mode: OpenFileMode
}

/**
 * @deprecated In favour of simple file store
 */
export default interface FS {
	open(path: string, options: OpenFileOptions): Promise<File>
}
