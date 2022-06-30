import { ABookID, ABookStore } from "@app/domain/abook/ABookStore"
import {
	ABookFileMetadata,
	ABookFileMetadataType,
} from "@app/domain/abook/typedef"
import {
	MPlayerPlaylistMetadata,
	MPlayerPlaylistMetadataType,
} from "@app/domain/bfr/playlist"
import { WTPSource, WTPSourceType } from "@app/domain/wtp/source"
import { WTPError } from "@app/domain/wtp/WTPError"

import { collectAsyncIterable } from "tws-common/lang/asyncIterator"

export enum WTPPlaylistMetadataType {
	ABOOK = "abook",
	ANY_SOURCES = "anySources",
}

export type WTPPlaylistMetadata =
	| {
			type: WTPPlaylistMetadataType.ABOOK
			abookId: ABookID
	  }
	| {
			type: WTPPlaylistMetadataType.ANY_SOURCES
			sources: WTPSource[]
	  }

export class WTPPlaylistResolverError extends WTPError {}

export class WTPPlaylistResolver {
	constructor(private readonly abookStore: ABookStore) {}

	resolveWTPPlaylist = async (
		playlistMetadata: WTPPlaylistMetadata,
	): Promise<{
		playlistMetadata: MPlayerPlaylistMetadata
		sources: WTPSource[]
	}> => {
		if (playlistMetadata.type === WTPPlaylistMetadataType.ANY_SOURCES) {
			return {
				playlistMetadata: {
					type: MPlayerPlaylistMetadataType.NONE,
					wtpPlaylist: playlistMetadata,
				},
				sources: [...playlistMetadata.sources],
			}
		} else {
			const abookActiveRecord = await this.abookStore.get(
				playlistMetadata.abookId,
			)
			if (!abookActiveRecord)
				throw new WTPPlaylistResolverError(
					`ABook with id ${playlistMetadata.abookId} does not exist`,
				)

			const files: {
				ordinalNumber: number
				id: string
			}[] = []
			const inputFileIds = await collectAsyncIterable(
				abookActiveRecord.files.keys(),
			)

			// Sort ids for deterministic order
			inputFileIds.sort((a, b) => a.localeCompare(b))

			for (const sourceId of inputFileIds) {
				const metadata = await abookActiveRecord.files.getMetadata(
					sourceId,
				)
				if (!metadata) continue // log it?

				if (metadata.type === ABookFileMetadataType.PLAYABLE) {
					files.push({
						ordinalNumber: metadata.ordinalNumber,
						id: sourceId,
					})
				}
			}

			files.sort((a, b) => a.ordinalNumber - b.ordinalNumber)
			const resultFileIds = files.map(f => f.id)

			return {
				playlistMetadata: {
					type: MPlayerPlaylistMetadataType.ABOOK,
					abook: abookActiveRecord,
					wtpPlaylist: playlistMetadata,
				},
				sources: resultFileIds.map(sourceId => ({
					type: WTPSourceType.ABOOK_FILE_SOURCE,
					abookId: abookActiveRecord.id,
					id: "abook/" + abookActiveRecord.id + "/" + sourceId,
					sourceId,
				})),
			}
		}
	}
}
