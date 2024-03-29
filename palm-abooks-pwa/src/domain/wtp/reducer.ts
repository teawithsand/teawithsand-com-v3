import { createReducer } from "@reduxjs/toolkit"

import {
	setWTPError,
	setWTPPlaylist,
	setWTPResolved,
} from "@app/domain/wtp/actions"
import { WTPState } from "@app/domain/wtp/state"

import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import { makeSyncRoot } from "tws-common/redux/sync/root"

const LOG_TAG = claimId(NS_LOG_TAG, "palm-abooks-pwa/WTPReducer")

export const whatToPlayReducer = createReducer<WTPState>(
	{
		config: {
			playlist: makeSyncRoot(null),
		},
		state: makeSyncRoot({
			type: "no-sources",
		}),
	},
	builder =>
		builder
			.addCase(setWTPPlaylist, (state, action) => {
				state.config.playlist = makeSyncRoot(action.payload)

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
						"Current state: ",
						state.state.data.type,
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
						"Current state: ",
						state.state.data.type,
					)
				}
			}),
)
