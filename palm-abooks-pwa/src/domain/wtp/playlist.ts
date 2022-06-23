import { ABookID, ABookStore } from "@app/domain/abook/ABookStore"
import { MPlayerPlaylistMetadata } from "@app/domain/bfr/playlist"
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

	resolveWTPSource = (
		playlist: WTPPlaylist,
	): Promise<MPlayerPlaylistMetadata> => {
		throw new Error("NIY")
	}
}
