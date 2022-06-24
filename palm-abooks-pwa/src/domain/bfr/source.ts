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
			// preloaded metadata, if any
			// won't change until sources change
			preloadedMetadata: MetadataLoadingResult | null
			// unique id of source, required
			id: string
			// Underlying WTPSource, which contains info about origin of this source
			whatToPlaySource: WTPSource
	  } & PlayerSource

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
