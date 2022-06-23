import { ABookID, ABookStore } from "@app/domain/abook/ABookStore"
import {
	MPlayerPlaylistMetadata,
	MPlayerPlaylistMetadataType,
} from "@app/domain/bfr/playlist"
import { WTPSource } from "@app/domain/wtp/source"

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
	): Promise<MPlayerPlaylistMetadata> => {
		if (playlist.type === WTPPlaylistType.ANY_SOURCES) {
			return {
				type: MPlayerPlaylistMetadataType.NONE,
				wtpPlaylist: playlist,
			}
		} else {
			const abookActiveRecord = await this.abookStore.get(
				playlist.abookId,
			)
			if (!abookActiveRecord)
				throw new WTPPlaylistResolverError(
					`ABook with id ${playlist.abookId} does not exist`,
				)

			return {
				type: MPlayerPlaylistMetadataType.ABOOK,
				abook: abookActiveRecord,
				wtpPlaylist: playlist,
			}
		}
	}
}
