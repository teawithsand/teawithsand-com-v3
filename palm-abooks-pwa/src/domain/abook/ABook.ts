/**
 * AudioBook stored in local DB.
 */
export default interface ABook {
	/**
	 * Unique ID of this ABook.
	 */
	id: string

	/**
	 * Title AKA display name of this ABook.
	 */
	title: string

	/**
	 * A short description about ABook.
	 */
	description: string

	/**
	 * List of files, which this ABook owns.
	 * Not only music files are there, but also other ones.
	 */
	files: ABookFileSource
}

export type ABookPosition = {
	fileIndex: number
	fileOffset: number
}

export type ABookFileSource = {
	type: "files"
	entries: string[] // each string is id of entry in ABookFileStore
}
