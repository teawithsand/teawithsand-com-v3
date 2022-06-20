import {
	getNowPerformanceTimestamp,
	PerformanceTimestampMs,
} from "tws-common/lang/time/Timestamp"
import { AudioFilter } from "tws-common/player/filter/filter"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import PlayerSourceError from "tws-common/player/source/PlayerSourceError"
import PlayerNetworkState from "tws-common/player/tool/PlayerNetworkState"
import PlayerReadyState from "tws-common/player/tool/PlayerReadyState"
import { NamedSyncRoot } from "tws-common/redux/sync/root"

export type BFRPlayerState = {
	playerError: MediaError | null
	sourceError: PlayerSourceError | null

	position: number | null
	duration: number | null

	isPlaying: boolean
	isSeeking: boolean

	networkState: PlayerNetworkState
	readyState: PlayerReadyState
}

export const IDLE_BFR_PLAYER_STATE: BFRPlayerState = {
	playerError: null,
	sourceError: null,
	duration: null,
	position: null,
	isPlaying: false,
	isSeeking: false,
	networkState: PlayerNetworkState.IDLE,
	readyState: PlayerReadyState.NOTHING,
}

export type BFRSleepConfig = {
	resetOnDeviceShake: boolean
	turnVolumeDownBeforeEnd: boolean
	durationMs: number
}

export type BFRSleepState = {
	lastSetAt: PerformanceTimestampMs
}

export const bfrSeekDataSyncRootName = "tws-common/bfr-seek-data"
export const bfrPlaylistSyncRootName = "tws-common/bfr-playlist"
export const bfrAudioFiltersSyncRootName = "tws-common/bfr-audio-filters"

export type BFRPlaylist<M, S> = {
	metadata: M
	sources: S[]
}

export type BFRState<PM = any, PS = any> = {
	playerConfig: {
		isPlayingWhenReady: boolean
		speed: number
		preservePitchForSpeed: boolean
		volume: number
		seekData: NamedSyncRoot<
			{ position: number } | null,
			typeof bfrSeekDataSyncRootName
		>
		playlist: NamedSyncRoot<
			BFRPlaylist<PM, PS> | null,
			typeof bfrPlaylistSyncRootName
		>
		filters: NamedSyncRoot<AudioFilter[], typeof bfrPlaylistSyncRootName>
		allowExternalSetIsPlayingWhenReady: boolean
		// Ended state when this is greater than playlist length
		currentSourceIndex: number
	}

	metadataLoaderConfig: {
		loadMetadataPolicy: "never" | "not-loaded" | "not-loaded-or-error"
		loadedMetadataResultSave: boolean
	}
	metadataState: MetadataBag // empty bag when no playlist or it has no sources
	sleepConfig: BFRSleepConfig | null // when null, then sleep unset
	sleepState: BFRSleepState | null // when null, then sleep task unset, for instance because playback is paused
	backAfterPauseConfig: {
		// Sorted sequence of pairs
		// If pause is up to given time, then on before playback starts
		// do seek by backBy value.
		config: {
			pauseUpTo: number
			backBy: number
		}[]
	}
	playerState: BFRPlayerState
}

export const bfrPlaylistSelector = <PM, PS>(state: BFRState<PM, PS>) =>
	state.playerConfig.playlist

export const bfrSleepStateSelector = (
	state: BFRState,
	now?: PerformanceTimestampMs,
) => {
	if (state.sleepConfig === null) {
		return null
	}
	now = now ?? getNowPerformanceTimestamp()
	const lastSetAt = state.sleepState?.lastSetAt ?? null
	const durationLeft =
		lastSetAt !== null
			? Math.max(state.sleepConfig.durationMs - (now - lastSetAt))
			: state.sleepConfig.durationMs
	return {
		totalDuration: state.sleepConfig.durationMs,
		durationLeft,
	}
}

// TODO(teawithsand): write some selectors for BFR
