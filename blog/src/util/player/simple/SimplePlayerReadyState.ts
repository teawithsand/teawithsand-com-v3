enum SimplePlayerReadyState {
	NOTHING,
	METADATA,
	CURRENT_DATA,
	FUTURE_DATA,
	ENOUGH_DATA,
}

export const simplePlayerReadyStateFromNative = (
	n: number,
): SimplePlayerReadyState => {
	if (n == 0) {
		return SimplePlayerReadyState.NOTHING
	} else if (n == 1) {
		return SimplePlayerReadyState.METADATA
	} else if (n == 2) {
		return SimplePlayerReadyState.CURRENT_DATA
	} else if (n == 3) {
		return SimplePlayerReadyState.FUTURE_DATA
	} else if (n == 4) {
		return SimplePlayerReadyState.ENOUGH_DATA
	} else {
		return SimplePlayerReadyState.NOTHING // actually it should throw imho
	}
}

export default SimplePlayerReadyState
