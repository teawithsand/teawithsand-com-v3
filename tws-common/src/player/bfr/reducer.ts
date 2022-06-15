import { createReducer } from "@reduxjs/toolkit"
import {
	setIsPlayingWhenReady,
	setPlaylist,
	setSpeed,
	setVolume,
} from "tws-common/player/bfr/actions"
import { BFRState } from "tws-common/player/bfr/state"
import { makeSyncRoot } from "tws-common/redux/sync/root"

export const BFRReducer = createReducer<BFRState>(
	{
		playerConfig: {
			isPlayingWhenReady: false,

			currentSourceIndex: 0,
			playlist: makeSyncRoot([]),

			seekData: makeSyncRoot(null),

			speed: 1,
			volume: 1,
		},
		backAfterPauseConfig: {
			config: [],
		},
		metadataLoaderConfig: {
			loadedMetadataResultSave: true,
			loadMetadataPolicy: "not-loaded-or-error",
		},
		playerState: null,

		sleepConfig: null,
		sleepState: null,
	},
	builder =>
		builder
			.addCase(setPlaylist, (state, action) => {
				state.playerConfig.playlist = makeSyncRoot(action.payload)
			})
			.addCase(setIsPlayingWhenReady, (state, action) => {
				state.playerConfig.isPlayingWhenReady = action.payload
			})
			.addCase(setSpeed, (state, action) => {
				state.playerConfig.speed = action.payload
			})
			.addCase(setVolume, (state, action) => {
				state.playerConfig.volume = action.payload
			}),
)
