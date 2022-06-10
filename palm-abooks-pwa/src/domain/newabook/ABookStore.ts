import {
	ObjectFileStoreObject,
	StoredFileObject,
} from "tws-common/file/ofs/ObjectFileStore"
import Metadata from "tws-common/player/metadata/Metadata"
import PlayerSource from "tws-common/player/source/PlayerSource"

export interface ABookMetadata {
	title: string
	description: string
	addedAt: number
}

export interface ABookReadProjection {
	metadata: ABookMetadata
	playableEntries: ABookPlayableEntry[]
	imageEntries: ABookImageEntry[]
	descriptionEntries: ABookDescriptionEntry[]
}

export interface ABookPlayableEntry {
	fileId: string
	source: PlayerSource
	metadata: Metadata | null
}

export interface ABookImageEntry {
	fileId: string
}

export interface ABookDescriptionEntry {
	fileId: string
}

export type ABookEntryAddData =
	| {
			type: "url"
			url: string
	  }
	| {
			type: "file"
			data: ObjectFileStoreObject
	  }

export default interface ABookStore {
	/**
	 * Returns complete data about single ABook.
	 */
	getABook(id: string): Promise<ABookReadProjection | null>

	/**
	 * Returns true if abook was deleted, false otherwise.
	 */
	deleteABook(id: string): Promise<boolean>

	/**
	 * Creates abook with specified id and metadata and no entries.
	 */
	createABook(id: string, metadata: ABookMetadata): Promise<void>

	/**
	 * Updates metadata of ABook provided.
	 */
	setMetadata(id: string, metadata: ABookMetadata): Promise<void>

	/**
	 * Deletes some entry from specified abook.
	 * Returns true if entry was deleted.
	 */
	deleteABookEntry(abookId: string, entryId: string): Promise<boolean>

	/**
	 * Adds new entry to abook.
	 * Returns id of new entry.
	 */
	addABookEntry(abookId: string, data: ABookEntryAddData): Promise<string>

	/**
	 * Returns reference to file with specified id on specified ABook.
	 */
	getFile(abookId: string, entryId: string): Promise<StoredFileObject | null>
}
