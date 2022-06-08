export const collectAsyncIterable = async <T>(
	iterable: AsyncIterable<T>,
): Promise<T[]> => {
	const arr = []
	for await (const v of iterable) {
		arr.push(v)
	}
	return arr
}

/**
 * It's surprising how often such function becomes handy.
 */
export const collectAndSortAsyncIterable = async <T>(
	iterable: AsyncIterable<T>,
	comparator?: (a: T, b: T) => number,
): Promise<T[]> => {
	const arr = []
	for await (const v of iterable) {
		arr.push(v)
	}

	arr.sort(comparator)
	return arr
}

export async function* makeAsyncIterable<T>(iterable: Iterable<T>) {
	for (const e of iterable) {
		yield e
	}
}
