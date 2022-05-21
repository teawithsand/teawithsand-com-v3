import SimplePlayerNetworkState from "@app/components/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState from "@app/components/player/simple/SimplePlayerReadyState"

type SimplePlayerEvent =
	| {
			// all state should be reset, since load was triggered
			// any error should be reset.
			type: "load"
	  }
	| {
			// An error occurred
			// It's persistent until load is called.
			type: "error"
			error: MediaError
	  }
	| {
			// IsPlayingWhenReady changed, because some outside world intervention ocurred.
			// For example, user has bluetooth headset and used it to pause playback.
			type: "isPlayingWhenReadyChanged"
			isPlayingWhenReady: boolean
	  }
	| {
			// Playback ended, and even if IsPlayingWhenReady, it won't really play.
			type: "ended"
	  }
	| {
			type: "positionChanged"
			position: number
	  }
	| {
			type: "durationChanged"
			duration: number
	  }
	| {
			type: "stateChange"
			networkState: SimplePlayerNetworkState
			readyState: SimplePlayerReadyState
			seeking: boolean
	  }

export default SimplePlayerEvent
