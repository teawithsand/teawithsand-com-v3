import { MPlayerPlaylistMetadata } from "@app/domain/bfr/playlist"
import { MPlayerSource } from "@app/domain/bfr/source"
import { DisplayInfoError } from "@app/domain/displayInfo/error"
import { WTPPlaylistMetadata } from "@app/domain/wtp/playlist"
import { WTPSource } from "@app/domain/wtp/source"
import { WTPError } from "@app/domain/wtp/WTPError"

import { claimId, NS_SYNC_ROOT } from "tws-common/misc/GlobalIDManager"
import { BFRPlaylist } from "tws-common/player/bfr/state"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import { NamedSyncRoot } from "tws-common/redux/sync/root"

export const displayInfoBFRPlaylistSyncRootName = claimId(
	NS_SYNC_ROOT,
	"palm-abooks-pwa/display-info/bfr-playlist",
)

export const displayInfoWTPPlaylistSyncRootName = claimId(
	NS_SYNC_ROOT,
	"palm-abooks-pwa/display-info/wtp-playlist",
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
	| {
			type: "loading"
			info: NullablePartial<DisplayInfo>
	  }
	| {
			type: "loaded"
			info: DisplayInfo
	  }
	| {
			type: "error"
			error: DisplayInfoError // TODO(teawithsand): type error to provide user with useful feedback
	  }

export type DisplayInfoState = {
	sync: {
		// TODO(teawithsand): request metadata bag here from BFR
		bfrPlaylist: BFRPlaylist<MPlayerPlaylistMetadata, MPlayerSource> | null
		wtpPlaylistMetadata: WTPPlaylistMetadata | null
		error: WTPError | null
	}
	state: DisplayInfoStateState
}
