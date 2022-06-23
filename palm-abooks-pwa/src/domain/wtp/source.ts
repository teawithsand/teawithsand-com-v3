import { ABOOK_DATA_STORE } from "@app/domain/abook/ABookDataStore"
import { ABOOK_FILE_STORE } from "@app/domain/abook/ABookFileStore"
import { ABookID } from "@app/domain/abook/ABookStore"
import { MPlayerSource } from "@app/domain/bfr/source"

import BaseError from "tws-common/lang/error"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"

export enum WTPSourceType {
	URL_SOURCE = "urlSource",
	BLOB_SOURCE = "blobSource",
	ABOOK_FILE_SOURCE = "abookFile",
}

/**
 * Contains location/way of accessing sources provided externally.
 */
export type WTPSource =
	| {
			type: WTPSourceType.URL_SOURCE
			source: string
			preloadedMetadata: MetadataLoadingResult | null // if any
	  }
	| {
			type: WTPSourceType.BLOB_SOURCE
			// it's idea behind this source - it includes blob directly, it can although it should not be serialized
			source: Blob | File
			preloadedMetadata: MetadataLoadingResult | null // if any
			fileName: string | null // if any, can be used for presentation purposes
	  }
	| {
			type: WTPSourceType.ABOOK_FILE_SOURCE
			abookId: ABookID
			sourceId: string
			// TODO(teawithsand): include any file data, which is stored along with ABook file if required
	  }

export class WTPSourceResolverError extends BaseError {}

export class WTPSourceResolver {
	constructor(
		private readonly abookStore: typeof ABOOK_DATA_STORE,
		private readonly abookFilesStore: typeof ABOOK_FILE_STORE,
	) {}

	resolveWTPSource = (source: WTPSource): Promise<MPlayerSource> => {
		throw new Error("NIY")
	}
}
