import { Path } from "@app/util/sfs/Path"

export enum WriteMode {
	Override,
	Append,
}

export default interface FileStore {
	read(key: Path): Promise<ReadableStream>
	write(key: Path, mode: WriteMode): Promise<WritableStream>
	delete(prefix: Path): Promise<void>
	list(prefix: Path): AsyncIterable<string> // list of paths as string
}
