import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"

export enum ABookFileMetadataType {
	PLAYABLE = "playable",
	IMAGE = "image",
	TXT_DESCRIPTION = "txtDescription",
}

export type ABookFileMetadata = (
	| {
			type: ABookFileMetadataType.PLAYABLE
			metadataLoadingResult: MetadataLoadingResult | null
	  }
	| {
			type: ABookFileMetadataType.IMAGE
	  }
	| {
			type: ABookFileMetadataType.TXT_DESCRIPTION
	  }
) & {
	// URL source of given file.
	// It should be used if file obtained is empty.
	// It means that it's remote resource, which was not scheduled to be downloaded by user.
	url: string | null
	// for URLs it may not be provided, otherwise it should be there
	fileName: string | null

	/**
	 * Index of this file, which should be used to determine file play order.
	 * Two files in same ABook *shouldn't* have save ordinalNumber.
	 *
	 * ON starts with 0 and is positive, finite integer or +0
	 */
	ordinalNumber: number
}

export type LoadedABookFileMetadata = ABookFileMetadata & { id: string }
