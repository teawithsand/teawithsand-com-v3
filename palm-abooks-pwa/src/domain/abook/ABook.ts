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
}

export type ABookPosition = {
	fileIndex: number
	fileOffset: number
}

export type ABookFileSource = {
	type: "files"
	entries: ABookFileRef[]
}

export type ABookFileRef =
	| {
			type: "local-stored"
			path: string
	  }
	| {
			type: "url"
			url: string
	  }
