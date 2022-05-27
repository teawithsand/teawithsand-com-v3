export interface Reader {
	/**
	 * Returns amount of bytes read.
	 */
	readToBuffer(buf: ArrayBufferLike): Promise<number>

	/**
	 * Reads some amount of data to array buffer.
	 */
	read(): Promise<ArrayBuffer>

	/**
	 * Reads rest of reader to newly allocated ArrayBuffer.
	 */
	readAll(): Promise<ArrayBuffer>

	close(): Promise<void>
}
export interface Writer {
	/**
	 * Returns amount of bytes written.
	 */
	write(buf: ArrayBufferLike): Promise<number>
	close(): Promise<void>
}

export type Path = string | string[]

export enum WriteMode {
	Override,
	Append,
}

export default interface FileStore {
	openForReading(key: Path): Promise<Reader>
	openForWriting(key: Path, mode: WriteMode): Promise<Writer>
	delete(prefix: Path): Promise<void>
	list(prefix: Path): AsyncIterable<string> // list of paths as string
}
