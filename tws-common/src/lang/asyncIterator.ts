export const collectAsyncIterable = async <T>(
	iterable: AsyncIterable<T>,
): Promise<T[]> => {
	const arr = []
	for await (const v of iterable) {
		arr.push(v)
	}
	return arr
}
