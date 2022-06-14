import { Timestamp } from "tws-common/lang/time/Timestamp"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState"
import { PlayerSourceWithMetadata } from "tws-common/player/source/PlayerSource"
import PlayerSourceError from "tws-common/player/source/PlayerSourceError"

export type PlaybackState = {
	playerError: MediaError | null
	sourceError: PlayerSourceError | null

	currentPosition: number | null
	currentDuration: number | null

	isPlaying: boolean
	isSeeking: boolean

	networkState: SimplePlayerNetworkState
	readyState: SimplePlayerReadyState
}

export type SleepConfig = {
	resetOnDeviceShake: boolean
	turnVolumeDownBeforeEnd: boolean
	duration: number | null // if null, then disabled
}

export type BFRState = {
	playerConfig: {
		isPlayingWhenReady: boolean
		speed: number
		volume: number
		seekData: {
			position: number
			id: string
		} | null
		playlist: PlayerSourceWithMetadata[]
		// Ended state when this is greater than playlist length
		currentSourceIndex: number
	}

	metadataLoaderConfig: {
		loadMetadataPolicy: "never" | "not-loaded" | "not-loaded-or-error"
		loadedMetadataResultSave: boolean
	}
	sleepConfig: SleepConfig
	sleepState: {
		lastSetAt: Timestamp
	} | null
	backAfterPauseConfig: {
		// Sorted sequence of pairs
		// If pause is up to given time, then on before playback starts
		// do seek by backBy value.
		config: {
			pauseUpTo: number
			backBy: number
		}[]
	}
	playerPlaylistState: {
		playlistId: string
	}
	playerState: {
		playlistState: {
			metadataBag: MetadataBag
		}
		playbackState: PlaybackState
	} | null
}

export const BFRPlaylistSelector = (
	state: BFRState,
): [PlayerSourceWithMetadata[], string] => [
	state.playerConfig.playlist,
	state.playerPlaylistState.playlistId,
]

// TODO(teawithsand): write some selectors for BFR
