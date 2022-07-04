import { MPlayerPlaylistMetadata } from "@app/domain/bfr/playlist"
import { MPlayerSource } from "@app/domain/bfr/source"
import { DisplayInfoError } from "@app/domain/displayInfo/error"
import { WTPPlaylistMetadata } from "@app/domain/wtp/playlist"
import { WTPSource } from "@app/domain/wtp/source"
import { WTPError } from "@app/domain/wtp/WTPError"

import { claimId, NS_SYNC_ROOT } from "tws-common/misc/GlobalIDManager"
import { BFRPlaylist } from "tws-common/player/bfr/state"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import { NamedSyncRoot } from "tws-common/redux/sync/root"

export const displayInfoPlaylistSyncRootName = claimId(
	NS_SYNC_ROOT,
	"palm-abooks-pwa/display-info/bfr-playlist",
)

export const displayInfoMetadataSyncRootName = claimId(
	NS_SYNC_ROOT,
	"palm-abooks-pwa/display-info/metadata-bag",
)

export const displayInfoWTPErrorSyncRootName = claimId

export type DisplaySource = (
	| {
			type: "wtp"
			wtpSource: WTPSource
	  }
	| {
			type: "wtp-bfr"
			wtpSource: WTPSource // note: this info is redundant, but can be left here
			playerSource: MPlayerSource
	  }
) & {
	// name for source presentation
	name: string
	metadata: MetadataLoadingResult | null
}

/**
 * Contains information, which is to-change during playback, like current album to show in media session
 * and other info of that kind.
 */
export type CurrentDisplayInfo = {
	// TODO(teawithsand): implement contents of this type
}

/**
 * Display info contains playback information, which in general should not change
 * once it was loaded for some playlist.
 */
export type DisplayInfo = {
	playbackTitle: string
	sources: DisplayInfo[]
	currentInfo: CurrentDisplayInfo | null
}

type NullablePartial<T> = {
	[P in keyof T]: T[P] | null
}

export type DisplayInfoStateState =
	| {
			type: "no-sources"
	  }
	| ((
			| {
					type: "loading"
			  }
			| {
					type: "loaded"
					info: DisplayInfo // in loaded state full info is required
			  }
			| {
					type: "error"
					error: DisplayInfoError // TODO(teawithsand): type error to provide user with useful feedback
			  }
	  ) & {
			info: NullablePartial<DisplayInfo>
	  })

export type DisplayInfoPlaylist =
	| {
			type: "bfr"
			playlist: BFRPlaylist<MPlayerPlaylistMetadata, MPlayerSource>
	  }
	| {
			type: "wtp"
			wtp: WTPPlaylistMetadata
			error: WTPError | null
	  }

export type DisplayInfoStateResolved =
	| {
			type: "resolved"
			// TODO(teawithsand): any data here, like ABook metadata or sth
	  }
	| {
			type: "error"
			error: DisplayInfoError
	  }

export type DisplayInfoState = {
	sync: {
		// TODO(teawithsand): request metadata bag here from BFR
		playlist: NamedSyncRoot<
			DisplayInfoPlaylist | null,
			typeof displayInfoPlaylistSyncRootName
		>
		metadataBag: NamedSyncRoot<
			MetadataBag,
			typeof displayInfoMetadataSyncRootName
		>
		// TODO(teawithsand): consider mirroring errors in here as well, 
		//  at least from WTP and forwarding them, so they can be detected more easily
	}
	resolved: DisplayInfoStateResolved | null
	state: DisplayInfoStateState
}
