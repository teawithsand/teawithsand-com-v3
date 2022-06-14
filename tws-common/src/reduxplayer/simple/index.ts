import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState"
import PlayerSource from "tws-common/player/source/PlayerSource"
import PlayerSourceError from "tws-common/player/source/PlayerSourceError"
import { makeHTMLReduxPlayerReducer } from "tws-common/reduxplayer/simple/reducer"

export type SimpleReduxPlayerState = {
	config: {
		isPlayingWhenReady: boolean
		source: PlayerSource | null
		speed: number
		volume: number
		seekData: {
			to: number
			id: string
		} | null
	}
	playerState: {
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

export { makeHTMLReduxPlayerReducer }
export * from "tws-common/reduxplayer/simple/actions"
