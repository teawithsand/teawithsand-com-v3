import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"

export enum ABookFileMetadataType {
	PLAYABLE_FILE = "playable_file",
	PLAYABLE_URL = "playable_url",
	IMAGE = "image",
	TXT_DESCRIPTION = "txtDescription",
}

export type ABookFileMetadata = (
	| ((
			| {
					type: ABookFileMetadataType.PLAYABLE_FILE
			  }
			| {
					type: ABookFileMetadataType.PLAYABLE_URL
					url: string
			  }
	  ) & {
			metadataLoadingResult: MetadataLoadingResult | null
	  })
	| {
			type: ABookFileMetadataType.IMAGE
	  }
	| {
			type: ABookFileMetadataType.TXT_DESCRIPTION
	  }
) & {
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
