enum PlayerReadyState {
	NOTHING,
	METADATA,
	CURRENT_DATA,
	FUTURE_DATA,
	ENOUGH_DATA,
}

export const simplePlayerReadyStateFromNative = (
	n: number,
): PlayerReadyState => {
	if (n == 0) {
		return PlayerReadyState.NOTHING
	} else if (n == 1) {
		return PlayerReadyState.METADATA
	} else if (n == 2) {
		return PlayerReadyState.CURRENT_DATA
	} else if (n == 3) {
		return PlayerReadyState.FUTURE_DATA
	} else if (n == 4) {
		return PlayerReadyState.ENOUGH_DATA
	} else {
		return PlayerReadyState.NOTHING // actually it should throw imho
	}
}

export default PlayerReadyState
