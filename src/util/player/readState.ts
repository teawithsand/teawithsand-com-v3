import { simplePlayerNetworkStateFromNative } from "@app/components/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState, {
	simplePlayerReadyStateFromNative,
} from "@app/components/player/simple/SimplePlayerReadyState"

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

export const readHTMLPlayerState = (element: Element) => {
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
