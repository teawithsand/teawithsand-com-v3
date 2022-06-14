import { createReducer } from "@reduxjs/toolkit";
import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState";
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState";
import { SimpleReduxPlayerState } from "tws-common/reduxplayer/simple";
import { onExternalSetIsPlayingWhenReady, setIsPlayingWhenReady, setReleased, setSource, setSpeed, setVolume } from "tws-common/reduxplayer/simple/actions";

export const makeHTMLReduxPlayerReducer = () => {
	createReducer<SimpleReduxPlayerState>(
		{
			config: {
				isPlayingWhenReady: false,
				source: null,
				speed: 1,
				volume: 1,
				seekData: null,
			},
			playerState: {
				currentDuration: null,
				currentPosition: null,

				isPlaying: false,
				isSeeking: false,

				networkState: SimplePlayerNetworkState.NO_SOURCE,
				readyState: SimplePlayerReadyState.NOTHING,

				playerError: null,
				sourceError: null,
			},
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
					state.config.source = null
				})
				.addCase(setSource, (state, action) => {
					state.config.source = action.payload
				}),
	)
}