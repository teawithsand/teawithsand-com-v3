import { createReducer } from "@reduxjs/toolkit"

import {
	displayInfoBFRPlaylistSyncRootName,
	DisplayInfoState,
	displayInfoWTPPlaylistSyncRootName,
} from "@app/domain/displayInfo/state"
import { State } from "@app/domain/redux/store"

import { makeSyncRoot } from "tws-common/redux/sync/root"
import {
	makeActionSynchronizerAction,
	makeNamedSyncRootSynchronizer,
} from "tws-common/redux/sync/synchronizer"

export const displayInfoWTPPlaylistSynchronizer = makeNamedSyncRootSynchronizer(
	displayInfoWTPPlaylistSyncRootName,
	(s: State) => s.whatToPlayState.state, // TODO(teawithsand): use config here and make it sync root
	makeActionSynchronizerAction((s: State) => {
		const data = s.whatToPlayState.config.playlist

		// TODO(teawithsand): implement this synchronizer once actions are here

		return []
	}),
)

export const displayInfoBFRPlaylistSynchronizer = makeNamedSyncRootSynchronizer(
	displayInfoBFRPlaylistSyncRootName,
	(s: State) => s.whatToPlayState.state,
	makeActionSynchronizerAction((s: State) => {
		const data = s.whatToPlayState.state.data

		// TODO(teawithsand): implement this synchronizer once actions are here

		if (data.type === "loaded") {
		} else if (data.type === "loading") {
		} else if (data.type === "error") {
		} else if(data.type === "no-sources") {
		}

		return []
	}),
)

export const displayInfoReducer = createReducer<DisplayInfoState>(
	{
		sync: {
			bfrPlaylist: makeSyncRoot(null),
			wtpPlaylistMetadata: makeSyncRoot(null),
		},
		state: {
			type: "no-sources",
		},
	},
	builder => {
		// TODO(teawithsand): add actions here
	},
)
