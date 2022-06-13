import { ABOOK_DATA_STORE } from "@app/domain/abook/ABookDataStore"
import { ABOOK_FILE_STORE } from "@app/domain/abook/ABookFileStore"
import ABookStoreImpl from "@app/domain/abook/ABookStoreImpl"
import ObjectFileStore from "tws-common/file/ofs/ObjectFileStore"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import { Timestamp } from "tws-common/lang/time/Timestamp"

export interface ABookMetadata {
	title: string
	description: string
	addedAt: Timestamp
}

export interface LoadedABookData extends ABookData {
	id: string
}

export interface ABookData {
	metadata: ABookMetadata
}


export type ABookFileMetadata =
	| {
			type: "playable"
			metadataLoadingResult: MetadataLoadingResult | null
	  }
	| {
			type: "image"
	  }

export type ABookID = string

export interface ABookActiveRecord extends Readonly<LoadedABookData> {
	readonly id: ABookID
	readonly metadata: ABookMetadata
	readonly data: LoadedABookData

	readonly files: ObjectFileStore<ABookFileMetadata>
	delete: () => Promise<void>
	setMetadata(metadata: ABookMetadata): Promise<void>
}

export interface ABookStore {
	create(metadata: ABookMetadata): Promise<ABookID>
	delete(id: ABookID): Promise<void>
	get(id: ABookID): Promise<ABookActiveRecord | null>
	has(id: ABookID): Promise<boolean>
	keys(): AsyncIterable<ABookID>
}

export const ABOOK_STORE: ABookStore = new ABookStoreImpl(
	ABOOK_DATA_STORE,
	ABOOK_FILE_STORE,
)
export const useABookStore = (): ABookStore => ABOOK_STORE
