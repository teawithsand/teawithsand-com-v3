import { createReducer } from "@reduxjs/toolkit"

import { State } from "@app/domain/redux/store"
import {
	setWTPError,
	setWTPPlaylist,
	setWTPResolved,
} from "@app/domain/wtp/actions"
import { whatToPlayStateSyncRootName, WTPState } from "@app/domain/wtp/state"

import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import { setPlaylist } from "tws-common/player/bfr/actions"
import { makeSyncRoot } from "tws-common/redux/sync/root"
import {
	makeActionSynchronizerAction,
	makeNamedSyncRootSynchronizer,
} from "tws-common/redux/sync/synchronizer"

const LOG_TAG = claimId(NS_LOG_TAG, "palm-abooks-pwa/WTPReducer")

export const playlistSynchronizer = makeNamedSyncRootSynchronizer(
	whatToPlayStateSyncRootName,
	(s: State) => s.whatToPlayState.state,
	makeActionSynchronizerAction((s: State) => {
		const data = s.whatToPlayState.state.data

		if (data.type === "loading") {
			return [
				setPlaylist({
					metadata: {},
					sources: [],
				}),
			]
		} else {
			return [
				setPlaylist({
					metadata: {},
					sources: data.sources,
				}),
			]
		}
	}),
)

export const whatToPlayReducer = createReducer<WTPState>(
	{
		config: {
			playlist: null,
		},
		state: makeSyncRoot({
			type: "no-sources",
		}),
	},
	builder =>
		builder
			.addCase(setWTPPlaylist, (state, action) => {
				state.config.playlist = action.payload

				if (state.config.playlist === null) {
					state.state = makeSyncRoot({
						type: "no-sources",
					})
				} else {
					state.state = makeSyncRoot({
						type: "loading",
					})
				}
			})
			.addCase(setWTPError, (state, action) => {
				if (state.state.data.type === "loading") {
					state.state = makeSyncRoot({
						type: "error",
						error: action.payload,
					})
				} else {
					LOG.warn(
						LOG_TAG,
						"Tried to set WTP error in not-loading state; ignoring this call",
					)
				}
			})
			.addCase(setWTPResolved, (state, action) => {
				if (state.state.data.type === "loading") {
					state.state = makeSyncRoot({
						type: "loaded",
						bfrPlaylist: action.payload,
					})
				} else {
					LOG.warn(
						LOG_TAG,
						"Tried to set WTP resolved in not-loading state; ignoring this call",
					)
				}
			}),
)
