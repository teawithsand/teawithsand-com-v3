enum SimplePlayerNetworkState {
	EMPTY,
	IDLE,
	LOADING,
	NO_SOURCE,
}

export const simplePlayerNetworkStateFromNative = (
	n: number,
): SimplePlayerNetworkState => {
	if (n == 0) {
		return SimplePlayerNetworkState.EMPTY
	} else if (n == 1) {
		return SimplePlayerNetworkState.IDLE
	} else if (n == 2) {
		return SimplePlayerNetworkState.LOADING
	} else if (n == 3) {
		return SimplePlayerNetworkState.NO_SOURCE
	} else {
		return SimplePlayerNetworkState.EMPTY // actually it should throw imho
	}
}

export default SimplePlayerNetworkState
