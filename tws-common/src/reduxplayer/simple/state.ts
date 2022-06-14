import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState"
import PlayerSource from "tws-common/player/source/PlayerSource"
import PlayerSourceError from "tws-common/player/source/PlayerSourceError"

export type SimpleReduxPlayerState = {
	config: {
		isPlayingWhenReady: boolean
		speed: number
		volume: number
		seekData: {
			position: number
			id: string
		} | null
	}
	// ended when currentSourceIndex is greater than playlist length
	playlistConfigState: {
		playlist: PlayerSource[]
		currentSourceIndex: number
	} | null
	state: {
		playerError: MediaError | null
		sourceError: PlayerSourceError | null

		currentPosition: number | null
		currentDuration: number | null

		isPlaying: boolean
		isSeeking: boolean

		networkState: SimplePlayerNetworkState
		readyState: SimplePlayerReadyState
	}
}
