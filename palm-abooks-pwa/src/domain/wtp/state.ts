import { MPlayerPlaylistMetadata } from "@app/domain/bfr/playlist"
import { MPlayerSource } from "@app/domain/bfr/source"
import { WTPPlaylistMetadata } from "@app/domain/wtp/playlist"
import { WTPError } from "@app/domain/wtp/WTPError"

import { claimId, NS_SYNC_ROOT } from "tws-common/misc/GlobalIDManager"
import { BFRPlaylist } from "tws-common/player/bfr/state"
import { NamedSyncRoot } from "tws-common/redux/sync/root"

export const whatToPlayStateSyncRootName = claimId(
	NS_SYNC_ROOT,
	"palm-abooks-pwa/what-to-play/state",
)

export const whatToPlayPlaylistSyncRootName = claimId(
	NS_SYNC_ROOT,
	"palm-abooks-pwa/what-to-play/playlist",
)

export type WTPStateState =
	| {
			type: "no-sources"
	  }
	| {
			type: "loading"
	  }
	| {
			type: "loaded"
			bfrPlaylist: BFRPlaylist<MPlayerPlaylistMetadata, MPlayerSource>
	  }
	| {
			type: "error"
			error: WTPError // TODO(teawithsand): type error to provide user with useful feedback
	  }

export type WTPState = {
	config: {
		playlist: NamedSyncRoot<
			WTPPlaylistMetadata | null,
			typeof whatToPlayPlaylistSyncRootName
		>
	}
	state: NamedSyncRoot<WTPStateState, typeof whatToPlayStateSyncRootName>
}
