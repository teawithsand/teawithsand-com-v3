import { AnyAction, createReducer } from "@reduxjs/toolkit"
import { DefaultTaskAtom } from "tws-common/lang/task/TaskAtom"
import DefaultMetadataLoader from "tws-common/player/metadata/DefaultMetadataLoader"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import {
	setPlaylist,
	simpleReduxPlayerReducer,
	SimpleReduxPlayerState,
} from "tws-common/reduxplayer/simple"
import {
	setLoadedSources as setSourcesWithMetadata,
	updateSourceMetadata,
} from "tws-common/reduxplayer/whattoplay/actions"
import { WhatToPlayState } from "tws-common/reduxplayer/whattoplay/state"

export const whatToPlayReducer = createReducer<WhatToPlayState>(
	{
		deps: {
			atom: new DefaultTaskAtom(),
			loader: new DefaultMetadataLoader(),
		},
		config: {
			loadedSources: [],
			loadedMetadataResultSave: true,
			loadMetadataPolicy: "not-loaded-or-error",
		},
		state: {
			metadataBag: new MetadataBag([]),
			playerSources: [],
		},
	},
	builder => {
		builder
			.addCase(setSourcesWithMetadata, (state, action) => {
				state.config.loadedSources = action.payload
				state.state.playerSources = action.payload.map(
					src => src.playerSource,
				)
				state.state.metadataBag = new MetadataBag(
					action.payload.map(src => src.metadata),
				)

				// TODO(teawithsand): here start metadata loading + saving
				//  depending on current policy settings
				//  + interrupt existing loading
				// OR:
				// Setup external manager, which subscribes to WTP and does exactly that - loads metadata and/or saves it
			})
			.addCase(updateSourceMetadata, (state, action) => {
				const { index, metadata } = action.payload
				state.config.loadedSources[index].metadata = metadata
			})
	},
)

/**
 * Makes What-To-Play control player's source list.
 */
export const wrapWhatToPlayToPlayerReducer = <
	T extends {
		simpleReduxPlayerState: SimpleReduxPlayerState
		whatToPlayState: WhatToPlayState
	},
	A extends AnyAction,
>(
	reducer: (state: T, action: A) => T,
) => {
	return (state: T, action: A) => {
		state = reducer(state, action)

		if (action.type === setSourcesWithMetadata.type) {
			if (!state.whatToPlayState) throw new Error("unreachable code")
			state = {
				...state,
				simpleReduxPlayerState: simpleReduxPlayerReducer(
					state.simpleReduxPlayerState,
					setPlaylist(state.whatToPlayState.state.playerSources),
				),
			}
		}

		return state
	}
}
