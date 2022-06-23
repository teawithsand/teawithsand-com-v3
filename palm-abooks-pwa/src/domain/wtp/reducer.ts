import { createReducer } from "@reduxjs/toolkit"

import { State } from "@app/domain/redux/store"
import { setWhatToPlaySource } from "@app/domain/wtp/actions"
import { WTPPlaylistType } from "@app/domain/wtp/playlist"
import { whatToPlayStateSyncRootName, WTPState } from "@app/domain/wtp/state"

import { LOG } from "tws-common/log/logger"
import { setPlaylist } from "tws-common/player/bfr/actions"
import { makeSyncRoot } from "tws-common/redux/sync/root"
import {
	makeActionSynchronizerAction,
	makeNamedSyncRootSynchronizer,
} from "tws-common/redux/sync/synchronizer"

const LOG_TAG = "palm-abooks-pwa/WTPReducer"

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
			type: "loaded",
			sources: [],
		}),
	},
	builder =>
		builder.addCase(setWhatToPlaySource, (state, action) => {
			state.config.playlist = action.payload

			if (state.config.playlist === null) {
				state.state = makeSyncRoot({
					type: "loaded",
					sources: [],
				})
			} else if (
				state.config.playlist.type === WTPPlaylistType.ANY_SOURCES
			) {
				throw new Error("NIY Resolve WTPSource into MPlayerSource")
			} else if (state.config.playlist.type === WTPPlaylistType.ABOOK) {
				throw new Error(
					"NIY Resolve abook into WTPSources and then into MPlayerSources",
				)
			} else {
				// TODO(teawithsand): trigger any load required here
				LOG.assert(
					LOG_TAG,
					"Not implemented loading of sources for",
					state.config.playlist,
				)
				state.state = makeSyncRoot({
					type: "loading",
				})
			}
		}),
)
