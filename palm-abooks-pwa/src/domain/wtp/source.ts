import { ABookID, ABookStore } from "@app/domain/abook/ABookStore"
import { ABookFileMetadataType } from "@app/domain/abook/typedef"
import { MPlayerSource, MPlayerSourceType } from "@app/domain/bfr/source"
import { WTPError } from "@app/domain/wtp/WTPError"

import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"

export enum WTPSourceType {
	URL_SOURCE = "urlSource",
	BLOB_SOURCE = "blobSource",
	ABOOK_FILE_SOURCE = "abookFile",
}

/**
 * Contains location/way of accessing sources provided externally.
 */
export type WTPSource = (
	| {
			type: WTPSourceType.URL_SOURCE
			url: string
			preloadedMetadata: MetadataLoadingResult | null // if any
	  }
	| {
			type: WTPSourceType.BLOB_SOURCE
			// it's idea behind this source - it includes blob directly, it can although it should not be serialized
			blob: Blob | File
			preloadedMetadata: MetadataLoadingResult | null // if any
			fileName: string | null // if any, can be used for presentation purposes
	  }
	| {
			type: WTPSourceType.ABOOK_FILE_SOURCE
			abookId: ABookID
			sourceId: string
			// TODO(teawithsand): include any file data, which is stored along with ABook file if required
	  }
) & {
	id: string
}

export class WTPSourceResolverError extends WTPError {}

export class WTPSourceResolver {
	constructor(private readonly abookStore: ABookStore) {}

	resolveWTPSource = async (source: WTPSource): Promise<MPlayerSource> => {
		if (source.type === WTPSourceType.URL_SOURCE) {
			return {
				type: MPlayerSourceType.URL,
				id: source.id,
				preloadedMetadata: source.preloadedMetadata,
				url: source.url,
				whatToPlaySource: source,
			}
		} else if (source.type === WTPSourceType.ABOOK_FILE_SOURCE) {
			const abookActiveRecord = await this.abookStore.get(source.abookId)
			if (!abookActiveRecord)
				throw new WTPSourceResolverError(
					`ABook with id "${source.abookId}" does not exist(requested by source with id "${source.id}")`,
				)

			const meta = await abookActiveRecord.files.getMetadata(
				source.sourceId,
			)
			if (!meta) {
				throw new WTPSourceResolverError(
					`ABook with id "${source.abookId}" does not have source with id "${source.sourceId}" (requested by source with id "${source.id}")`,
				)
			}

			if (meta.type !== ABookFileMetadataType.PLAYABLE) {
				throw new WTPSourceResolverError(
					`ABook with id "${source.abookId}" has source with id "${source.sourceId}" but it's not playable file (requested by source with id "${source.id}")`,
				)
			}

			// TODO(teawithsand): better resolving strategy, which uses cached file if one is available
			if (meta.url !== null) {
				return {
					type: MPlayerSourceType.URL,
					id: source.id,
					preloadedMetadata: meta.metadataLoadingResult,
					url: meta.url,
					whatToPlaySource: source,
				}
			}

			return {
				type: MPlayerSourceType.LOADER,
				id: source.id,
				preloadedMetadata: meta.metadataLoadingResult,
				sourceLoader: async () => {
					const res = await abookActiveRecord.files.getFile(
						source.sourceId,
					)
					if (!res || res.innerObject.size === 0) {
						throw new WTPSourceResolverError(
							`ABook with id "${source.abookId}" *had* source with id "${source.sourceId}" but it's not there anymore(or it's empty) (requested by source with id "${source.id}")`,
						)
					}

					return res.innerObject
				},
				whatToPlaySource: source,
			}
		} else if (source.type === WTPSourceType.BLOB_SOURCE) {
			return {
				type: MPlayerSourceType.LOADER,
				id: source.id,
				preloadedMetadata: source.preloadedMetadata,
				sourceLoader: async () => source.blob,
				whatToPlaySource: source,
			}
		} else {
			throw new Error(`unreachable code`)
		}
	}
}
