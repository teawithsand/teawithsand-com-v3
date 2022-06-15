import { ABookActiveRecord } from "@app/domain/abook/ABookStore"
import { setWhatToPlaySource } from "@app/domain/redux/actions"
import { State } from "@app/domain/redux/store"
import { createReducer } from "@reduxjs/toolkit"
import { generateUUID } from "tws-common/lang/uuid"
import { setPlaylist } from "tws-common/player/bfr/actions"
import PlayerSource, {
	PlayerSourceWithMetadata,
} from "tws-common/player/source/PlayerSource"
import { makeSyncRoot, NamedSyncRoot } from "tws-common/redux/sync/root"
import {
	makeActionSynchronizerAction,
	makeNamedSyncRootSynchronizer,
} from "tws-common/redux/sync/synchronizer"

export type WhatToPlaySource =
	| {
			type: "abook"
			abook: ABookActiveRecord
	  }
	| {
			type: "raw-no-meta"
			sources: PlayerSource[]
	  }
	| {
			type: "raw-with-meta"
			sources: PlayerSourceWithMetadata[]
	  }

type WhatToPlayStateState =
	| {
			type: "loading"
	  }
	| {
			type: "loaded"
			sources: PlayerSourceWithMetadata[]
	  }

export const whatToPlayStateSyncRootName = "palm-abooks-pwa/what-to-play-state"

export const playlistSynchronizer = makeNamedSyncRootSynchronizer(
	whatToPlayStateSyncRootName,
	(s: State) => s.whatToPlayState.state,
	makeActionSynchronizerAction((s: State) => {
		const data = s.whatToPlayState.state.data

		if (data.type === "loading") {
			return [setPlaylist([])]
		} else {
			return [setPlaylist(data.sources)]
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
	syncState: {
		currentSourcesId: string
		setSourcesId: string
	}
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
		syncState: {
			currentSourcesId: "no-sources",
			setSourcesId: "no-sources",
		},
	},
	builder =>
		builder.addCase(setWhatToPlaySource, (state, action) => {
			state.config.source = action.payload
			state.syncState.currentSourcesId = generateUUID()

			if (state.config.source === null) {
				state.state = makeSyncRoot({
					type: "loaded",
					sources: [],
				})
			} else if (state.config.source.type === "raw-no-meta") {
				state.state = makeSyncRoot({
					type: "loaded",
					sources: state.config.source.sources.map(v => ({
						metadata: null,
						playerSource: v,
					})),
				})
			} else if (state.config.source.type === "raw-with-meta") {
				state.state = makeSyncRoot({
					type: "loaded",
					sources: state.config.source.sources,
				})
			} else {
				// TODO(teawithsand): trigger any load required here
				console.error("NIY")
				state.state = makeSyncRoot({
					type: "loading",
				})
			}
		}),
)
