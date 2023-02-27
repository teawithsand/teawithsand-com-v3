import { AnyAction } from "@reduxjs/toolkit"

import { State } from "@app/domain/redux/store"
import { whatToPlayStateSyncRootName } from "@app/domain/wtp/state"

import { setPlaylist } from "tws-common/player/bfr/actions"
import {
	makeActionSynchronizerAction,
	makeNamedSyncRootSynchronizer,
} from "tws-common/redux/sync/synchronizer"

export const whatToPlayStateSynchronizer = makeNamedSyncRootSynchronizer(
	whatToPlayStateSyncRootName,
	(s: State) => s.whatToPlayState.state,
	makeActionSynchronizerAction<State, AnyAction>((s: State) => {
		const data = s.whatToPlayState.state.data

		if (
			data.type === "loading" ||
			data.type === "error" ||
			data.type === "no-sources"
		) {
			return [
				setPlaylist({
					metadata: {},
					sources: [],
				}),
			]
		} else {
			return [setPlaylist(data.bfrPlaylist)]
		}
	}),
)
