import { MPlayerSource } from "@app/domain/bfr/source"
import { WTPPlaylist } from "@app/domain/wtp/playlist"

import { NamedSyncRoot } from "tws-common/redux/sync/root"

export const whatToPlayStateSyncRootName = "palm-abooks-pwa/what-to-play-state"

export type WTPStateState =
	| {
			type: "loading"
	  }
	| {
			type: "loaded"
			sources: MPlayerSource[]
	  }
	| {
			type: "error"
			error: any // TODO(teawithsand): type error to provide user with useful feedback
	  }

export type WTPState = {
	config: {
		playlist: WTPPlaylist | null
	}
	state: NamedSyncRoot<WTPStateState, typeof whatToPlayStateSyncRootName>
}