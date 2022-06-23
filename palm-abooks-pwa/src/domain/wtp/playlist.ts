import { ABookID, ABookStore } from "@app/domain/abook/ABookStore"
import { ABookFileMetadataType } from "@app/domain/abook/typedef"
import {
	MPlayerPlaylistMetadata,
	MPlayerPlaylistMetadataType,
} from "@app/domain/bfr/playlist"
import { WTPSource, WTPSourceType } from "@app/domain/wtp/source"

import BaseError from "tws-common/lang/error"

export enum WTPPlaylistType {
	ABOOK = "abook",
	ANY_SOURCES = "anySources",
}

export type WTPPlaylist =
	| {
			type: WTPPlaylistType.ABOOK
			abookId: ABookID
	  }
	| {
			type: WTPPlaylistType.ANY_SOURCES
			sources: WTPSource[]
	  }

export class WTPPlaylistResolverError extends BaseError {}

export class WTPPlaylistResolver {
	constructor(private readonly abookStore: ABookStore) {}

	resolveWTPSource = async (
		playlist: WTPPlaylist,
	): Promise<{
		metadata: MPlayerPlaylistMetadata
		sources: WTPSource[]
	}> => {
		if (playlist.type === WTPPlaylistType.ANY_SOURCES) {
			return {
				metadata: {
					type: MPlayerPlaylistMetadataType.NONE,
					wtpPlaylist: playlist,
				},
				sources: [...playlist.sources],
			}
		} else {
			const abookActiveRecord = await this.abookStore.get(
				playlist.abookId,
			)
			if (!abookActiveRecord)
				throw new WTPPlaylistResolverError(
					`ABook with id ${playlist.abookId} does not exist`,
				)

			const files: string[] = []
			for await (const sourceId of abookActiveRecord.files.keys()) {
				const metadata = await abookActiveRecord.files.getMetadata(
					sourceId,
				)
				if (!metadata) continue // log it?

				if (metadata.type === ABookFileMetadataType.PLAYABLE) {
					files.push(sourceId)
				}
			}

			return {
				metadata: {
					type: MPlayerPlaylistMetadataType.ABOOK,
					abook: abookActiveRecord,
					wtpPlaylist: playlist,
				},
				sources: files.map(sourceId => ({
					type: WTPSourceType.ABOOK_FILE_SOURCE,
					abookId: abookActiveRecord.id,
					id: "abook/" + abookActiveRecord.id + "/" + sourceId,
					sourceId,
				})),
			}
		}
	}
}
