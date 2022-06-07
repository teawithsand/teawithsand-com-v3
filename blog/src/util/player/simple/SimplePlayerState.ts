import SimplePlayerNetworkState from "@app/util/player/simple/SimplePlayerNetworkState";
import SimplePlayerReadyState from "@app/util/player/simple/SimplePlayerReadyState";
import PlayerSource from "@app/util/player/source/PlayerSource";


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
			error: MediaError
	  }
	| {
			type: "closed"
	  }

export default SimplePlayerState