/**
 * File, which may have some operations performed on it.
 * It follows lock semantics similar to web streams.
 */
export default interface File {
	/**
	 * Returns current position of cursor in file.
	 */
	position(): Promise<number>

    /**
     * Sets position relatively to start of file.
     * If pos is greater than file size, it's set to end of file.
     */
    setPosition(pos: number): Promise<void>

    /**
     * Moves position by specified amount of size.
     * It won't move file pointer before zero and after EOF.
     */
    movePosition(pos: number): Promise<void>

	/**
	 * Reads specified amount of bytes from file and yields array buffer.
	 * Also, advances the file pointer by size.
	 */
	read(size: number): Promise<ArrayBuffer>

	/**
	 * Reads specified amount of bytes from file and yields array buffer.
	 * Also, advances the file pointer by size.
	 */
	write(buf: ArrayBuffer): Promise<void>

	/**
	 * Returns readable stream, which reads till the end of file.
     * Closing stream, closes the file.
	 * File should not be used once it was called.
	 */
	getReadStream(): ReadableStream<ArrayBuffer>

	/**
	 * Returns writable stream, which writes to file.
	 * Closing stream, closes the file.
	 * File should not be used once it was called.
	 */
	getWriteStream(): WritableStream<ArrayBufferLike>

	/**
	 * Resizes file up to `size` bytes.
	 * It may only shrink file, not grow it.
	 */
	truncate(size: number): Promise<void>

	/**
	 * Ensures that all changes are stored to disk, if required.
	 */
	flush(): Promise<void>

	/**
	 * Closes file, releases resources and flushes changes if it's required.
	 */
	close(): Promise<void>
}
