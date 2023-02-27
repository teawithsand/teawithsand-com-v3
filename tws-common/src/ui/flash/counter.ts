let flashMessageCounter = -Number.MAX_SAFE_INTEGER

/**
 * Returns unique value of counter, which is used to order flashes, when they have same timestamps.
 */
export const getFlashMessageCounter = () => {
	return flashMessageCounter++
}
