import ObjectFileStore from "tws-common/file/ofs/ObjectFileStore"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"

export interface ABookMetadata {
	title: string
	description: string
	addedAt: number
}

export interface ABookData {
	metadata: ABookMetadata
}

export type ABookFileMetadata =
	| {
			type: "playable"
			metadata: MetadataLoadingResult | null
	  }
	| {
			type: "image"
	  }
	  
export type ABookID = string

export interface ABookActiveRecord {
	readonly id: ABookID
	readonly metadata: ABookMetadata

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
