import { createReducer } from "@reduxjs/toolkit"
import { generateUUID } from "tws-common/lang/uuid"
import {
	setIsPlayingWhenReady,
	setPlaylist,
	setSpeed,
	setVolume,
} from "tws-common/player/bfr/actions"
import { BFRState } from "tws-common/player/bfr/state"

export const BFRReducer = createReducer<BFRState>(
	{
		playerConfig: {
			isPlayingWhenReady: false,

			currentSourceIndex: 0,
			playlist: [],

			seekData: null,

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
		playerPlaylistState: {
			playlistId: "initial-playlist-id-1231332131",
		},
		playerState: null,

		sleepConfig: null,
		sleepState: null,
	},
	builder =>
		builder
			.addCase(setPlaylist, (state, action) => {
				state.playerConfig.playlist = action.payload
				state.playerPlaylistState.playlistId = generateUUID()
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
