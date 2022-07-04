import { AnyAction } from "@reduxjs/toolkit"

import {
	displayInfoSetMetadataBag,
	displayInfoSetPlaylist,
} from "@app/domain/displayInfo/actions"
import { State } from "@app/domain/redux/store"
import { whatToPlayStateSyncRootName } from "@app/domain/wtp/state"

import { setPlaylist } from "tws-common/player/bfr/actions"
import { bfrPlaylistSyncRootName } from "tws-common/player/bfr/state"
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
			const { data } = s.whatToPlayState.state
			if (
				data.type === "loading" ||
				data.type === "no-sources" ||
				data.type === "error"
			) {
				return [displayInfoSetPlaylist(null)]
			} else if (data.type === "loaded") {
				return [
					displayInfoSetPlaylist({
						type: "bfr",
						playlist: data.bfrPlaylist,
					}),
				]
			} else {
				throw new Error("unreachable code")
			}
		},
	),
)

export const bfrMetadataStateSynchronizer = makeNamedSyncRootSynchronizer(
	bfrPlaylistSyncRootName,
	(s: State) => s.bfrState.metadataState,
	makeActionSynchronizerAction<State, AnyAction>((s: State) => {
		const { data } = s.bfrState.metadataState
		return [displayInfoSetMetadataBag(data)]
	}),
)
