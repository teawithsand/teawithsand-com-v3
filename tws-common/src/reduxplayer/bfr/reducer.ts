import { createReducer } from "@reduxjs/toolkit"
import { generateUUID } from "tws-common/lang/uuid"
import { setPlaylist } from "tws-common/reduxplayer/bfr/actions"
import { BFRState } from "tws-common/reduxplayer/bfr/state"

export const simpleReduxPlayerReducer = createReducer<BFRState>(
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
		sleepConfig: {
			duration: null,
			resetOnDeviceShake: true,
			turnVolumeDownBeforeEnd: true,
		},
		sleepState: null,
	},
	builder =>
		builder.addCase(setPlaylist, (state, action) => {
			state.playerConfig.playlist = action.payload
			state.playerPlaylistState.playlistId = generateUUID()
		}),
)
