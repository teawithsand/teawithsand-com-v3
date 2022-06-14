import { createAction } from "@reduxjs/toolkit";
import { generateUUID } from "tws-common/lang/uuid";
import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState";
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState";
import PlayerSource from "tws-common/player/source/PlayerSource";
import PlayerSourceError from "tws-common/player/source/PlayerSourceError";
import { makeActionPrefix } from "tws-common/redux/action";


const prefix = makeActionPrefix("player")

export const setIsPlayingWhenReady = createAction<boolean>(
	`${prefix}/setIsPlayingWhenReady`,
)

export const setPlaylist = createAction<PlayerSource[]>(`${prefix}/setPlaylist`)
export const setSpeed = createAction<number>(`${prefix}/setSpeed`)
export const setVolume = createAction<number>(`${prefix}/setVolume`)
export const setReleased = createAction<void>(`${prefix}/setReleased`)

export const doSeek = createAction(
	`${prefix}/doSeek`,
	(target: number, sourceIndex: number | null = null) => ({
		payload: {
			to: target,
			sourceIndex: sourceIndex,
			id: generateUUID(),
		},
	}),
)

// This actions encapsulates change of state
// which has to be consistent immediately
export const onNewPlayerState = createAction<{
	playerError: MediaError | null
	sourceError: PlayerSourceError | null
	isPlaying: boolean
	isSeeking: boolean
	position: number | null
	duration: number | null
	networkState: SimplePlayerNetworkState
	readyState: SimplePlayerReadyState
}>(`${prefix}/onNewPlayerState`)

// These are helpers for things that change often
// and lack of consistency is allowed for these
// or will never happen due to nature of their existence

export const onPositionChanged = createAction<number | null>(
	`${prefix}/onPositionChanged`,
)

export const onDurationChanged = createAction<number | null>(
	`${prefix}/onDurationChanged`,
)

export const onExternalSetIsPlayingWhenReady = createAction<boolean>(
	`${prefix}/onExternalSetIsPlayingWhenReady`,
)
export const onSourcePlaybackEnded = createAction<void>(`${prefix}/onEnded`)