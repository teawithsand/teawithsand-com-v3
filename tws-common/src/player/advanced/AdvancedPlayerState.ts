import { Playlist } from "tws-common/player/advanced/AdvancedPlayer"
import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState"

type AdvancedPlayerState =
	| {
			type: "running"

			ended: boolean
			seeking: boolean
			readyState: SimplePlayerReadyState
			networkState: SimplePlayerNetworkState

			error: any | null

			isPlaying: boolean // is REALLY playing
			localCurrentTime: number | null
			localDuration: number | null

			currentSourceIndex: number | null
			playlist: Playlist

			isPlayingWhenReady: boolean
			rate: number
			volume: number
	  }
	| {
			type: "no-source"
	  }
	| {
			type: "closed"
	  }

export default AdvancedPlayerState
