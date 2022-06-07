export async function* makeAsyncIterable<T>(iterable: Iterable<T>) {
	for (const v of iterable) {
		yield v
	}
}
