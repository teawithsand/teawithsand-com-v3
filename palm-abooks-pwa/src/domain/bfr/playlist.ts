import { ABookActiveRecord } from "@app/domain/abook/ABookStore"
import { MPlayerSource } from "@app/domain/bfr/source"
import { WTPPlaylistMetadata } from "@app/domain/wtp/playlist"

import { BFRPlaylist } from "tws-common/player/bfr/state"

export enum MPlayerPlaylistMetadataType {
	// No metadata whatsoever, no playlist title or sth
	NONE = "none",

	// ABook Active record should be available
	ABOOK = "abook",
}

/**
 * Playlist metadata derived from WTPPlaylist/WTPPlaylistMetadata.
 */
export type MPlayerPlaylistMetadata = (
	| {
			type: MPlayerPlaylistMetadataType.NONE
	  }
	| {
			type: MPlayerPlaylistMetadataType.ABOOK
			abook: ABookActiveRecord
	  }
) & {
	// playlist given playlist metadata was created from
	wtpPlaylist: WTPPlaylistMetadata
}

export type MBFRPlaylist = BFRPlaylist<MPlayerPlaylistMetadata, MPlayerSource>
