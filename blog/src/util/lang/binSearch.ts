export const binarySearchSync = ({
	oracle,
	startIndex,
	lastIndex,
}: {
	oracle: (i: number) => number
	startIndex?: number
	lastIndex: number
}) => {
	startIndex = startIndex ?? 0

	let l = startIndex
	let r = lastIndex

	while (l <= r) {
		const idx = Math.floor(l + (r - l) / 2)
		const res = oracle(idx)
		if (res === 0) return idx
		if (res < 0) {
			l = idx + 1
		} else {
			r = idx - 1
		}
	}

    // not found
    return null
}

export const binarySearch = async ({
	oracle,
	startIndex,
	lastIndex,
}: {
	oracle: (i: number) => Promise<number>
	startIndex?: number
	lastIndex: number
}) => {
	startIndex = startIndex ?? 0

	let l = startIndex
	let r = lastIndex

	while (l <= r) {
		const idx = Math.floor(l + (r - l) / 2)
		const res = await oracle(idx)
		if (res === 0) return idx
		if (res < 0) {
			l = idx + 1
		} else {
			r = idx - 1
		}
	}

    // not found
    return null
}
