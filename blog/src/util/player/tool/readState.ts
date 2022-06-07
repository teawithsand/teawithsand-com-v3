import SimplePlayerNetworkState, {
	simplePlayerNetworkStateFromNative,
} from "@app/util/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState, {
	simplePlayerReadyStateFromNative,
} from "@app/util/player/simple/SimplePlayerReadyState"

type Element = HTMLAudioElement | HTMLMediaElement | HTMLVideoElement

const sanitizeTime = (t: number): number | null =>
	isFinite(t) && t >= 0 ? t : null

const flattenBuffered = (ranges: TimeRanges) => {
	const res: {
		start: number
		end: number
	}[] = []
	for (let i = 0; i < ranges.length; i++) {
		res.push({
			start: ranges.start(i),
			end: ranges.end(i),
		})
	}
	return res
}

export type HTMLPlayerState = {
	error: MediaError | null
	paused: boolean
	networkState: number
	readyState: number
	seeking: boolean
	ended: boolean

	simpleNetworkState: SimplePlayerNetworkState
	simpleReadyState: SimplePlayerReadyState

	isPlaying: boolean

	currentTime: number | null
	duration: number | null

	buffered: {
		start: number
		end: number
	}[]
}

export const readHTMLPlayerState = (element: Element): HTMLPlayerState => {
	const {
		error,
		paused,
		networkState,
		readyState,
		currentTime,
		duration,
		seeking,
		ended,
		buffered,
	} = element

	const simpleNetworkState = simplePlayerNetworkStateFromNative(networkState)
	const simpleReadyState = simplePlayerReadyStateFromNative(readyState)

	return {
		error,
		paused,
		ended,
		currentTime: sanitizeTime(currentTime),
		duration: sanitizeTime(duration),
		seeking,
		networkState, // : simplePlayerNetworkStateFromNative(networkState),
		readyState, //: simplePlayerReadyStateFromNative(readyState),
		simpleReadyState,
		simpleNetworkState,
		buffered: flattenBuffered(buffered),

		isPlaying:
			!seeking &&
			!paused &&
			!ended &&
			simpleReadyState === SimplePlayerReadyState.ENOUGH_DATA,
	}
}
