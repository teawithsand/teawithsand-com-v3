import { createReducer } from "@reduxjs/toolkit"
import {
	onExternalSetIsPlayingWhenReady,
	onNewPlayerState,
	onSourcePlaybackEnded,
	setIsPlayingWhenReady,
	setPlaylist,
	setSpeed,
	setVolume,
} from "tws-common/player/bfr/actions"
import { BFRState, IDLE_PLAYBACK_STATE } from "tws-common/player/bfr/state"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import { makeSyncRoot } from "tws-common/redux/sync/root"

// TODO(teawithsand): implement missing reducers
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
		playerState: {
			playbackState: IDLE_PLAYBACK_STATE,
			playlistState: {
				metadataBag: new MetadataBag([]),
			},
		},

		sleepConfig: null,
		sleepState: null,
	},
	builder =>
		builder
			.addCase(onNewPlayerState, (state, action) => {
				const {
					duration,
					isPlaying,
					isSeeking,
					networkState,
					playerError,
					position,
					readyState,
					sourceError,
				} = action.payload
				state.playerState = {
					...state.playerState,
					playbackState: {
						duration,
						position,
						isPlaying,
						isSeeking,
						networkState,
						playerError,
						readyState,
						sourceError,
					},
				}
			})
			.addCase(onSourcePlaybackEnded, state => {
				state.playerConfig.currentSourceIndex += 1
			})
			.addCase(setPlaylist, (state, action) => {
				state.playerConfig.playlist = makeSyncRoot(action.payload)
				state.playerState = {
					playbackState: IDLE_PLAYBACK_STATE,
					playlistState: {
						metadataBag: new MetadataBag(
							state.playerConfig.playlist.data.map(
								v => v.metadata,
							),
						),
					},
				}
			})
			.addCase(setIsPlayingWhenReady, (state, action) => {
				state.playerConfig.isPlayingWhenReady = action.payload
			})
			.addCase(onExternalSetIsPlayingWhenReady, (state, action) => {
				state.playerConfig.isPlayingWhenReady = action.payload
			})
			.addCase(setSpeed, (state, action) => {
				state.playerConfig.speed = action.payload
			})
			.addCase(setVolume, (state, action) => {
				state.playerConfig.volume = action.payload
			}),
)
