let toastCounter = -Number.MAX_SAFE_INTEGER

/**
 * Returns unique value of counter, which is used to order toasts, when they have same timestamps.
 */
export const getToastCounter = () => {
	return toastCounter++
}
