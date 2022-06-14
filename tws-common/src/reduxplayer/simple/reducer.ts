import { createReducer } from "@reduxjs/toolkit"
import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState"
import { SimpleReduxPlayerState } from "tws-common/reduxplayer/simple"
import {
	doSeek,
	onExternalSetIsPlayingWhenReady,
	onSourcePlaybackEnded,
	setIsPlayingWhenReady,
	setPlaylist,
	setReleased,
	setSpeed,
	setVolume,
} from "tws-common/reduxplayer/simple/actions"

export const simpleReduxPlayerReducer = createReducer<SimpleReduxPlayerState>(
	{
		config: {
			isPlayingWhenReady: false,
			speed: 1,
			volume: 1,
			seekData: null,
		},
		state: {
			currentDuration: null,
			currentPosition: null,

			isPlaying: false,
			isSeeking: false,

			networkState: SimplePlayerNetworkState.NO_SOURCE,
			readyState: SimplePlayerReadyState.NOTHING,

			playerError: null,
			sourceError: null,
		},
		playlistConfigState: null,
	},
	builder =>
		builder
			.addCase(setIsPlayingWhenReady, (state, action) => {
				state.config.isPlayingWhenReady = action.payload
			})
			.addCase(setSpeed, (state, action) => {
				state.config.speed = action.payload
			})
			.addCase(setVolume, (state, action) => {
				state.config.volume = action.payload
			})
			.addCase(onExternalSetIsPlayingWhenReady, (state, action) => {
				state.config.isPlayingWhenReady = action.payload
			})
			.addCase(setReleased, state => {
				state.state = {
					currentDuration: null,
					currentPosition: null,

					isPlaying: false,
					isSeeking: false,

					networkState: SimplePlayerNetworkState.NO_SOURCE,
					readyState: SimplePlayerReadyState.NOTHING,

					playerError: null,
					sourceError: null,
				}
				state.playlistConfigState = null
			})
			.addCase(setPlaylist, (state, action) => {
				if (action.payload.length === 0) {
					state.playlistConfigState = null
				} else {
					state.playlistConfigState = {
						playlist: action.payload,
						currentSourceIndex: 0,
					}
				}
			})
			.addCase(onSourcePlaybackEnded, state => {
				if (state.playlistConfigState !== null) {
					const { playlist, currentSourceIndex } =
						state.playlistConfigState

					if (currentSourceIndex < playlist.length) {
						state.playlistConfigState.currentSourceIndex += 1
					}
				}
			})
			.addCase(doSeek, (state, action) => {
				state.config.seekData = {
					id: action.payload.id,
					position: action.payload.to,
				}

				if (
					state.playlistConfigState !== null &&
					action.payload.sourceIndex
				) {
					state.playlistConfigState.currentSourceIndex = Math.min(
						action.payload.sourceIndex,
						state.playlistConfigState.playlist.length,
					)
				}
			}),
)
