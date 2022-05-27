import { Path } from "@app/util/sfs/Path"

export enum WriteMode {
	Override,
	Append,
}

export type FileInfo = {
	size: number
}

export type ReadOptions = {
	offset?: number
	limit?: number
}

export const DEFAULT_WRITE_MODE = WriteMode.Override
export type WriteOptions = {
	mode?: WriteMode
}

export default interface FileStore {
	stat(key: Path): Promise<FileInfo | null>
	read(key: Path, options: ReadOptions): Promise<ReadableStream>
	write(key: Path, options: WriteOptions): Promise<WritableStream>
	delete(prefix: Path): Promise<void>
	list(prefix: Path): AsyncIterable<string> // list of paths as string
}
