import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState"
import PlayerSource from "tws-common/player/source/PlayerSource"

type SimplePlayerState =
	| {
			type: "no-source"
	  }
	| {
			type: "running"
			source: PlayerSource
			ended: boolean
			seeking: boolean
			readyState: SimplePlayerReadyState
			networkState: SimplePlayerNetworkState
			isPlaying: boolean
			currentTime: number | null
			duration: number | null
			isPlayingWhenReady: boolean
	  }
	| {
			type: "error"
			error: any
	  }
	| {
			type: "closed"
	  }

export default SimplePlayerState
