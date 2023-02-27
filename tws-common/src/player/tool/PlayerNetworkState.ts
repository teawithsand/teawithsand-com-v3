enum PlayerNetworkState {
	EMPTY = 0,
	IDLE = 1,
	LOADING = 2,
	NO_SOURCE = 3,
}

export const simplePlayerNetworkStateFromNative = (
	n: number,
): PlayerNetworkState => {
	if (n === 0) {
		return PlayerNetworkState.EMPTY
	} else if (n === 1) {
		return PlayerNetworkState.IDLE
	} else if (n === 2) {
		return PlayerNetworkState.LOADING
	} else if (n === 3) {
		return PlayerNetworkState.NO_SOURCE
	} else {
		return PlayerNetworkState.EMPTY // actually it should throw imho
	}
}

export default PlayerNetworkState
