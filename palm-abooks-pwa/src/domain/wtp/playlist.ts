import { ABOOK_DATA_STORE } from "@app/domain/abook/ABookDataStore"
import { ABOOK_FILE_STORE } from "@app/domain/abook/ABookFileStore"
import { ABookID } from "@app/domain/abook/ABookStore"
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
	constructor(
		private readonly abookStore: typeof ABOOK_DATA_STORE,
		private readonly abookFilesStore: typeof ABOOK_FILE_STORE,
	) {}

	resolveWTPSource = (
		playlist: WTPPlaylist,
	): Promise<MPlayerPlaylistMetadata> => {
		throw new Error("NIY")
	}
}
