import { createAction } from "@reduxjs/toolkit"
import { BFRPlaylist, BFRSleepState } from "tws-common/player/bfr/state"
import { AudioFilter } from "tws-common/player/filter/filter"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import NewPlayerSourceError from "tws-common/player/newsource/NewPlayerSourceError"
import PlayerNetworkState from "tws-common/player/tool/PlayerNetworkState"
import PlayerReadyState from "tws-common/player/tool/PlayerReadyState"
import { makeActionPrefix } from "tws-common/redux/action"

const prefix = makeActionPrefix("bfr")

export const setIsPlayingWhenReady = createAction<boolean>(
	`${prefix}/setIsPlayingWhenReady`,
)

// TODO(teawithsand): this action is not type safe to use, create one which is
//  right now one can just dispatch it and reducer has to just typecast it into valid type.
//  It will result in bug, if invalid type gets passed here.
export const setPlaylist = createAction<BFRPlaylist<unknown, unknown>>(
	`${prefix}/setPlaylist`,
)
export const setMetadata = createAction<{
	i: number
	metadata: MetadataLoadingResult
}>(`${prefix}/setMetadata`)
export const setSpeed = createAction<number>(`${prefix}/setSpeed`)
export const setPreservePitchForSpeed = createAction<boolean>(
	`${prefix}/setPreservePitchForSpeed`,
)
export const setFilters = createAction<AudioFilter[]>(`${prefix}/setFilters`)
export const setVolume = createAction<number>(`${prefix}/setVolume`)

export const doSeek = createAction<number>(`${prefix}/doSeek`)

export const setAllowExternalSetIsPlayingWhenReady = createAction<boolean>(
	`${prefix}/setAllowExternalSetIsPlayingWhenReady`,
)

export const onNewPlayerState = createAction<{
	playerError: MediaError | null
	sourceError: NewPlayerSourceError | null
	isPlaying: boolean
	isSeeking: boolean
	isInnerEnded: boolean
	position: number | null
	duration: number | null
	networkState: PlayerNetworkState
	readyState: PlayerReadyState
}>(`${prefix}/onNewPlayerState`)

export const onExternalSetIsPlayingWhenReady = createAction<boolean>(
	`${prefix}/onExternalSetIsPlayingWhenReady`,
)
export const onSourcePlaybackEnded = createAction<void>(`${prefix}/onEnded`)

export const onSleepStateChanged = createAction<BFRSleepState | null>(
	`${prefix}/onSleepStateChanged`,
)
export const onSleepDone = createAction<void>(`${prefix}/onSleepDone`)
