import { createAction } from "@reduxjs/toolkit"
import {
	claimId,
	NS_REDUX_ACTION_PREFIX,
} from "tws-common/misc/GlobalIDManager"
import { BFRMetadataLoaderResults } from "tws-common/player/bfr/metadataLoader"
import { BFRPlaylist, BFRSleepState } from "tws-common/player/bfr/state"
import { AudioFilter } from "tws-common/player/filter/filter"
import PlayerSourceError from "tws-common/player/source/PlayerSourceError"
import PlayerNetworkState from "tws-common/player/tool/PlayerNetworkState"
import PlayerReadyState from "tws-common/player/tool/PlayerReadyState"

const prefix = claimId(NS_REDUX_ACTION_PREFIX, "tws-common/bfr")

export const setIsPlayingWhenReady = createAction<boolean>(
	`${prefix}/setIsPlayingWhenReady`,
)

// TODO(teawithsand): this action is not type safe to use, create one which is
//  right now one can just dispatch it and reducer has to just typecast it into valid type.
//  It will result in bug, if invalid type gets passed here.
export const setPlaylist = createAction<BFRPlaylist<unknown, unknown>>(
	`${prefix}/setPlaylist`,
)
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
export const setMetadataLoadingResults = createAction<BFRMetadataLoaderResults>(
	`${prefix}/setMetadataLoadingResults`,
)

export const onNewPlayerState = createAction<{
	playerError: MediaError | null
	sourceError: PlayerSourceError | null
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
