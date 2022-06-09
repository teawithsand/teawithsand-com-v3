/**
 * AudioBook stored in local DB.
 */
export default interface ABook {
	/**
	 * Unique ID of this ABook.
	 */
	uuid: string

	/**
	 * Title AKA display name of this ABook.
	 */
	title: string

	/**
	 * A short description about ABook.
	 */
	description: string

	/**
	 * ABookImage if any, or null if not set.
	 */
	image: ABookImage | null

	/**
	 * Files of this ABook.
	 */
	source: ABookFileSource

	/**
	 * Last position, when ABook was played.
	 */
	lastPosition: ABookPosition | null
}

export type ABookPosition = {
	fileIndex: number
	fileOffset: number
}

export type ABookFileSource = {
	type: "files"
	entries: ABookFile[]
}

export type ABookImage =
	| {
			type: "url"
			url: string
	  }
	| {
			type: "file-ref"
			path: string
	  }

export type ABookFile =
	| {
			type: "local-stored"
			path: string
	  }
	| {
			type: "url"
			url: string
	  }
