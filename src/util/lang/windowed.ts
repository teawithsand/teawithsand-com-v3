export default function* windowed<T>(
	iter: Iterable<T>,
	sz: number
): Generator<T[], void, void> {
	const arr: T[] = []
	for (const e of iter) {
		if (arr.length < sz) {
			arr.push(e)
		} else {
			yield arr

			arr.shift()
			arr.push(e)
		}
	}

	yield arr
}
