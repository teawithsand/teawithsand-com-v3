import { ABookActiveRecord } from "@app/domain/abook/ABookStore"
import { WTPPlaylistMetadata } from "@app/domain/wtp/playlist"

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
