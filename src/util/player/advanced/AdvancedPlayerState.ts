import { Playlist } from "@app/util/player/advanced/AdvancedPlayer"
import MetadataBag from "@app/util/player/metadata/MetadataBag"
import SimplePlayerNetworkState from "@app/util/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState from "@app/util/player/simple/SimplePlayerReadyState"

type AdvancedPlayerState =
	| {
			type: "running"

			ended: boolean
			seeking: boolean
			readyState: SimplePlayerReadyState
			networkState: SimplePlayerNetworkState

			error: MediaError | null

			isPlaying: boolean // is REALLY playing
			localCurrentTime: number | null
			localDuration: number | null

			globalCurrentPosition: number | null

			currentSourceIndex: number | null
			playlist: Playlist

			metadata: MetadataBag

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
