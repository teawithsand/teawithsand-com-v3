export const captureError = async <T, E = void>(
	promise: Promise<T>,
	fallback: E,
): Promise<T | E> => {
	try {
		return await promise
	} catch {
		return fallback
	}
}

export const promiseHasThrown = async <T>(promise: Promise<T>) => {
	try {
		await promise
		return false
	} catch (e) {
		return true
	}
}
