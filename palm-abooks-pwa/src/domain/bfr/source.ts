import {
	ABookFileMetadata,
	ABookFileMetadataType,
} from "@app/domain/abook/typedef"
import { WTPSource } from "@app/domain/wtp/source"

import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import { PlayerSource } from "tws-common/player/source/PlayerSource"
import {
	BasePlayerSourceResolver,
	BasePlayerSourceResolverExtractedData,
} from "tws-common/player/source/PlayerSourceResolver"

export enum MPlayerSourceType {
	LOADER = "loader",
	URL = "url",
}

/**
 * Source, which contains information required to play it + WTPSource it was created from.
 */
export type MPlayerSource =
	| (
			| {
					type: MPlayerSourceType.LOADER
					sourceLoader: () => Promise<Blob>
			  }
			| {
					type: MPlayerSourceType.URL
					url: string
			  }
	  ) & {
			// Metadata, used to provide things like display information here
			metadata: MPlayerSourceMetadata

			// unique id of source, required
			id: string

			// Underlying WTPSource, which contains info about origin of this source
			whatToPlaySource: WTPSource
	  } & PlayerSource

export enum MPlayerSourceMetadataType {
	EXTERNAL_FILE = 1,
	URL = 2,
	ABOOK_FILE = 3,
}

export type MPlayerSourceMetadata =
	| {
			type: MPlayerSourceMetadataType.EXTERNAL_FILE
			// all info here is adjusted to be used with local files
			// it does not quite make sense to use it outside this context
			fileName: string
			mimeType: string
			preloadedMetadata: MetadataLoadingResult | null
	  }
	| {
			type: MPlayerSourceMetadataType.URL
			url: string
			preloadedMetadata: MetadataLoadingResult | null
	  }
	| {
			type: MPlayerSourceMetadataType.ABOOK_FILE
			abookFileMetadata: ABookFileMetadata &
				// obviously, it has to be playable file
				(| { type: ABookFileMetadataType.PLAYABLE_FILE }
					| { type: ABookFileMetadataType.PLAYABLE_URL }
				)
	  }
/*
 & {
	// preloaded metadata, if any
	// won't change until sources change
	// it's declared no matter what type source is
	preloadedMetadata: MetadataLoadingResult | null
}*/

let globalInstance: MPlayerSourceResolver | null = null
export class MPlayerSourceResolver extends BasePlayerSourceResolver<MPlayerSource> {
	public static getInstance(): MPlayerSourceResolver {
		if (globalInstance === null) {
			globalInstance = new MPlayerSourceResolver()
		}
		return globalInstance
	}

	protected extractData = (
		source: MPlayerSource,
	): BasePlayerSourceResolverExtractedData => {
		if (source.type === MPlayerSourceType.URL) {
			return {
				type: "url",
				id: source.id,
				url: source.url,
			}
		} else if (source.type === MPlayerSourceType.LOADER) {
			return {
				type: "blob-loader",
				id: source.id,
				loader: source.sourceLoader,
			}
		} else {
			throw new Error("unreachable code")
		}
	}
}
