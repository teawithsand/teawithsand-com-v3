import SimplePlayerNetworkState from "@app/util/player/simple/SimplePlayerNetworkState";
import SimplePlayerReadyState from "@app/util/player/simple/SimplePlayerReadyState";


type SimplePlayerState =
	| {
			type: "no-source"
	  }
	| {
			type: "running"
            source: string
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