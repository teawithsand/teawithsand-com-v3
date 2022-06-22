import { createReducer } from "@reduxjs/toolkit"
import { castDraft } from "immer"
import { LOG } from "tws-common/log/logger"
import {
	doSeek,
	onExternalSetIsPlayingWhenReady,
	onNewPlayerState,
	onSourcePlaybackEnded,
	setAllowExternalSetIsPlayingWhenReady,
	setFilters,
	setIsPlayingWhenReady,
	setMetadataLoadingResults,
	setPlaylist,
	setPreservePitchForSpeed,
	setSpeed,
	setVolume,
} from "tws-common/player/bfr/actions"
import {
	BFRMediaSessionMode,
	BFRPlaylist,
	BFRState,
	IDLE_BFR_PLAYER_STATE,
} from "tws-common/player/bfr/state"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import { makeSyncRoot } from "tws-common/redux/sync/root"

const LOG_TAG = "tws-common/BFRReducer"
// TODO(teawithsand): implement missing reducers
export const createBFRReducer = <PM, PS>() =>
	createReducer<BFRState<PM, PS>>(
		{
			playerConfig: {
				isPlayingWhenReady: false,

				currentSourceIndex: 0,
				playlist: makeSyncRoot(null),

				seekData: makeSyncRoot(null),

				filters: makeSyncRoot([]),

				speed: 1,
				preservePitchForSpeed: false,
				volume: 1,

				allowExternalSetIsPlayingWhenReady: true,
			},
			mediaSessionConfig: {
				mode: BFRMediaSessionMode.ENABLED_WHEN_PLAYLIST_SET,
			},
			backAfterPauseConfig: {
				config: [],
			},
			metadataLoaderConfig: {
				loadedMetadataResultSave: true,
				loadMetadataPolicy: "not-loaded-or-error",
			},
			metadataState: new MetadataBag([]),
			playerState: IDLE_BFR_PLAYER_STATE,

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
						duration,
						position,
						isPlaying,
						isSeeking,
						networkState,
						playerError,
						readyState,
						sourceError,
					}
				})
				.addCase(onSourcePlaybackEnded, state => {
					state.playerConfig.currentSourceIndex += 1
				})
				.addCase(setPlaylist, (state, action) => {
					state.playerConfig.playlist = makeSyncRoot(
						castDraft(action.payload as BFRPlaylist<PM, PS>),
					)
					state.playerConfig.currentSourceIndex = 0 // always reset to first one on new playlist
					state.playerState = IDLE_BFR_PLAYER_STATE
					state.metadataState = new MetadataBag(
						new Array(
							state.playerConfig.playlist.data?.sources.length ??
								0,
						).fill(null),
					)
				})
				.addCase(setIsPlayingWhenReady, (state, action) => {
					state.playerConfig.isPlayingWhenReady = action.payload
				})
				.addCase(onExternalSetIsPlayingWhenReady, (state, action) => {
					LOG.debug(
						LOG_TAG,
						"Triggered onExternalSetIsPlayingWhenReady",
						action.payload,
						"Will change",
						state.playerConfig.allowExternalSetIsPlayingWhenReady,
					)

					if (state.playerConfig.allowExternalSetIsPlayingWhenReady) {
						state.playerConfig.isPlayingWhenReady = action.payload
					}
				})
				.addCase(setSpeed, (state, action) => {
					state.playerConfig.speed = action.payload
				})
				.addCase(setVolume, (state, action) => {
					state.playerConfig.volume = action.payload
				})
				.addCase(doSeek, (state, action) => {
					state.playerConfig.seekData = makeSyncRoot({
						position: action.payload,
					})
				})
				.addCase(
					setAllowExternalSetIsPlayingWhenReady,
					(state, action) => {
						state.playerConfig.allowExternalSetIsPlayingWhenReady =
							action.payload
					},
				)
				.addCase(setPreservePitchForSpeed, (state, action) => {
					state.playerConfig.preservePitchForSpeed = action.payload
				})
				.addCase(setFilters, (state, action) => {
					state.playerConfig.filters = makeSyncRoot(action.payload)
				})
				.addCase(setMetadataLoadingResults, (state, action) => {
					state.metadataState = new MetadataBag(action.payload)
				}),
	)
