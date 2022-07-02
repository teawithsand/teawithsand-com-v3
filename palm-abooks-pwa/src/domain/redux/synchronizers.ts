import { AnyAction } from "@reduxjs/toolkit"

import {
	displayInfoSetBFRPlaylist,
	displayInfoSetWTPError,
	displayInfoSetWTPPlaylistMetadata,
} from "@app/domain/displayInfo/actions"
import { State } from "@app/domain/redux/store"
import {
	whatToPlayPlaylistSyncRootName,
	whatToPlayStateSyncRootName,
} from "@app/domain/wtp/state"

import { setPlaylist } from "tws-common/player/bfr/actions"
import {
	makeActionSynchronizerAction,
	makeNamedSyncRootSynchronizer,
} from "tws-common/redux/sync/synchronizer"

export const whatToPlayStateSynchronizer = makeNamedSyncRootSynchronizer(
	whatToPlayStateSyncRootName,
	(s: State) => s.whatToPlayState.state,
	makeActionSynchronizerAction<State, AnyAction>(
		(s: State) => {
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
		},
		(s: State) => {
			const data = s.whatToPlayState.state.data
			if (data.type === "loading" || data.type === "no-sources") {
				return [
					displayInfoSetBFRPlaylist(null),
					// displayInfoSetWTPError(null), // setting playlist implies unsetting error
				]
			} else if (data.type === "error") {
				return [displayInfoSetWTPError(data.error)]
			} else if (data.type === "loaded") {
				return [displayInfoSetBFRPlaylist(data.bfrPlaylist)]
			} else {
				throw new Error("unreachable code")
			}
		},
	),
)

export const whatToPlayPlaylistSynchronizer = makeNamedSyncRootSynchronizer(
	whatToPlayPlaylistSyncRootName,
	(s: State) => s.whatToPlayState.config.playlist,
	makeActionSynchronizerAction<State, AnyAction>((s: State) => {
		const data = s.whatToPlayState.config.playlist.data
		return [displayInfoSetWTPPlaylistMetadata(data)]
	}),
)
