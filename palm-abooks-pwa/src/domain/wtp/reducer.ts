import { createReducer } from "@reduxjs/toolkit"

import { MPlayerSource } from "@app/domain/bfr/source"
import { State } from "@app/domain/redux/store"

import { LOG } from "tws-common/log/logger"
import { setPlaylist } from "tws-common/player/bfr/actions"
import { makeSyncRoot, NamedSyncRoot } from "tws-common/redux/sync/root"
import {
	makeActionSynchronizerAction,
	makeNamedSyncRootSynchronizer,
} from "tws-common/redux/sync/synchronizer"
import { setWhatToPlaySource } from "@app/domain/wtp/actions"

const LOG_TAG = "palm-abooks-pwa/WTPReducer"

export type WhatToPlaySource = {
	type: "files"
	sources: MPlayerSource[]
}

type WhatToPlayStateState =
	| {
			type: "loading"
	  }
	| {
			type: "loaded"
			sources: MPlayerSource[]
	  }

export const whatToPlayStateSyncRootName = "palm-abooks-pwa/what-to-play-state"

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

export type WhatToPlayState = {
	config: {
		source: WhatToPlaySource | null
	}
	state: NamedSyncRoot<
		WhatToPlayStateState,
		typeof whatToPlayStateSyncRootName
	>
}

export const whatToPlayReducer = createReducer<WhatToPlayState>(
	{
		config: {
			source: null,
		},
		state: makeSyncRoot({
			type: "loaded",
			sources: [],
		}),
	},
	builder =>
		builder.addCase(setWhatToPlaySource, (state, action) => {
			state.config.source = action.payload

			if (state.config.source === null) {
				state.state = makeSyncRoot({
					type: "loaded",
					sources: [],
				})
			} else if (state.config.source.type === "files") {
				state.state = makeSyncRoot({
					type: "loaded",
					sources: state.config.source.sources,
				})
			} else {
				// TODO(teawithsand): trigger any load required here
				LOG.assert(
					LOG_TAG,
					"Not implemented loading of sources for",
					state.config.source,
				)
				state.state = makeSyncRoot({
					type: "loading",
				})
			}
		}),
)
