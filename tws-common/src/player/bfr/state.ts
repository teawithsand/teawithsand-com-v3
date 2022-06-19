import { getNowPerformanceTimestamp, PerformanceTimestampMs } from "tws-common/lang/time/Timestamp";
import MetadataBag from "tws-common/player/metadata/MetadataBag";
import { PlayerSourceWithMetadata } from "tws-common/player/source/PlayerSource";
import PlayerSourceError from "tws-common/player/source/PlayerSourceError";
import PlayerNetworkState from "tws-common/player/tool/PlayerNetworkState";
import PlayerReadyState from "tws-common/player/tool/PlayerReadyState";
import { NamedSyncRoot } from "tws-common/redux/sync/root";


export type PlaybackState = {
	playerError: MediaError | null
	sourceError: PlayerSourceError | null

	position: number | null
	duration: number | null

	isPlaying: boolean
	isSeeking: boolean

	networkState: PlayerNetworkState
	readyState: PlayerReadyState
}

export const IDLE_PLAYBACK_STATE: PlaybackState = {
	playerError: null,
	sourceError: null,
	duration: null,
	position: null,
	isPlaying: false,
	isSeeking: false,
	networkState: PlayerNetworkState.IDLE,
	readyState: PlayerReadyState.NOTHING,
}

export type SleepConfig = {
	resetOnDeviceShake: boolean
	turnVolumeDownBeforeEnd: boolean
	durationMs: number
}

export type SleepState = {
	lastSetAt: PerformanceTimestampMs
}

export const bfrSeekDataSyncRootName = "tws-common/bfr-seek-data"
export const bfrPlaylistSyncRootName = "tws-common/bfr-playlist"

export type BFRState = {
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
			PlayerSourceWithMetadata[],
			typeof bfrPlaylistSyncRootName
		>
		allowExternalSetIsPlayingWhenReady: boolean
		// Ended state when this is greater than playlist length
		currentSourceIndex: number
	}

	metadataLoaderConfig: {
		loadMetadataPolicy: "never" | "not-loaded" | "not-loaded-or-error"
		loadedMetadataResultSave: boolean
	}
	sleepConfig: SleepConfig | null // when null, then sleep unset
	sleepState: SleepState | null // when null, then sleep task unset, for instance because playback is paused
	backAfterPauseConfig: {
		// Sorted sequence of pairs
		// If pause is up to given time, then on before playback starts
		// do seek by backBy value.
		config: {
			pauseUpTo: number
			backBy: number
		}[]
	}
	playerState: {
		playlistState: {
			metadataBag: MetadataBag
		}
		playbackState: PlaybackState
	}
}

export const bfrPlaylistSelector = (state: BFRState) =>
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