import { AnyAction } from "@reduxjs/toolkit"

import { State } from "@app/domain/redux/store"
import {
	whatToPlayStateSyncRootName
} from "@app/domain/wtp/state"

import { setPlaylist } from "tws-common/player/bfr/actions"
import {
	makeActionSynchronizerAction,
	makeNamedSyncRootSynchronizer
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
			const { data, id } = s.whatToPlayState.state
			/*
			if (data.type === "loading" || data.type === "no-sources") {
				return [
					displayInfoSetStateResolved({
						data,
						id,
					}),
					// displayInfoSetWTPError(null), // setting playlist implies unsetting error
				]
			} else if (data.type === "error") {
				return [displayInfoSetWTPError(data.error)]
			} else if (data.type === "loaded") {
				return [displayInfoSetStateResolved(data.bfrPlaylist)]
			} else {
				throw new Error("unreachable code")
			}
			*/
			throw new Error("NIY")
		},
	),
)
