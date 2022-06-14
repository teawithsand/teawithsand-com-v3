import { createAction } from "@reduxjs/toolkit"
import { generateUUID } from "tws-common/lang/uuid"
import { SleepState } from "tws-common/player/bfr/state"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import { PlayerSourceWithMetadata } from "tws-common/player/source/PlayerSource"
import PlayerSourceError from "tws-common/player/source/PlayerSourceError"
import SimplePlayerNetworkState from "tws-common/player/tool/PlayerNetworkState"
import SimplePlayerReadyState from "tws-common/player/tool/PlayerReadyState"
import { makeActionPrefix } from "tws-common/redux/action"

const prefix = makeActionPrefix("bfr")

export const setIsPlayingWhenReady = createAction<boolean>(
	`${prefix}/setIsPlayingWhenReady`,
)

export const setPlaylist = createAction<PlayerSourceWithMetadata[]>(
	`${prefix}/setPlaylist`,
)
export const setMetadata = createAction<{
	i: number
	metadata: MetadataLoadingResult
}>(`${prefix}/setMetadata`)
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

export const onNewPlayerState = createAction<{
	playerError: MediaError | null
	sourceError: PlayerSourceError | null
	isPlaying: boolean
	isSeeking: boolean
	isInnerEnded: boolean
	position: number | null
	duration: number | null
	networkState: SimplePlayerNetworkState
	readyState: SimplePlayerReadyState
}>(`${prefix}/onNewPlayerState`)

export const onExternalSetIsPlayingWhenReady = createAction<boolean>(
	`${prefix}/onExternalSetIsPlayingWhenReady`,
)
export const onSourcePlaybackEnded = createAction<void>(`${prefix}/onEnded`)

export const onSleepStateChanged = createAction<SleepState | null>(
	`${prefix}/onSleepStateChanged`,
)
export const onSleepDone = createAction<void>(`${prefix}/onSleepDone`)
