import PlayerSource from "@app/components/player/source/PlayerSource"
import PlayerSourceProvider from "@app/components/player/source/PlayerSourceProvider"

export enum PlayerDriverNetworkState {
	IDLE,
	LOADING,
}

export enum PlayerDriverReadyState {
	NOTHING,
	METADATA,
	CURRENT_DATA,
	FUTURE_DATA,
	ENOUGH_DATA,
}

export type PlayerDriverState = {
	// source, which driver is using. There is a lag between
	// changing user's source and driver picking it up.
	// So this has to be checked.
	currentSource: PlayerSource | null

	// Persistent error, which causes playback to stop.
	// null if none.
	error: any | null

	isEnded: boolean
	isSeeking: boolean

	duration: number
	currentPosition: number

	defaultPlaybackRate: number
	playbackRate: number

	volume: number

	networkState: PlayerDriverNetworkState
	readyState: PlayerDriverReadyState
}

// Represents operation, which sets state only once, and then this state is allowed to change
// also, once operations may be skipped, since only the latest state change matters.
type Once<T> = {
	id: string
	data: T
}

export type PlayerUserState = {
	sourceProvider: PlayerSourceProvider

	currentSourceIndex: number
	playbackRate: number

	seek: Once<{
		position: number
	}> | null
}

type PlayerState = {
	userState: PlayerUserState
	driverState: PlayerDriverState | null
}

export default PlayerState
