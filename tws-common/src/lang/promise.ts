export const captureError = <T, E = void>(
	promise: Promise<T>,
	fallback: E,
): Promise<T | E> => {
	return promise.catch(() => fallback)
}
