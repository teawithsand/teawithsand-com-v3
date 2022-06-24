import { ABookID, ABookStore } from "@app/domain/abook/ABookStore"
import { ABookFileMetadataType } from "@app/domain/abook/typedef"
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

			const files: string[] = []
			const fileIds = await collectAsyncIterable(
				abookActiveRecord.files.keys(),
			)

			// TODO(teawithsand): this kind of sorting is useless, but gives stability for now
			//  it should be fixed to sort files by name, special offset or some other parameter
			fileIds.sort((a, b) => a.localeCompare(b))

			for (const sourceId of fileIds) {
				const metadata = await abookActiveRecord.files.getMetadata(
					sourceId,
				)
				if (!metadata) continue // log it?

				if (metadata.type === ABookFileMetadataType.PLAYABLE) {
					files.push(sourceId)
				}
			}

			return {
				playlistMetadata: {
					type: MPlayerPlaylistMetadataType.ABOOK,
					abook: abookActiveRecord,
					wtpPlaylist: playlistMetadata,
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
