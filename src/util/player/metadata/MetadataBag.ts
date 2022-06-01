import {
	MetadataLoadingResult,
	MetadataLoadingResultType,
} from "@app/util/player/metadata/Metadata"

/**
 * Bag, which contains multiple MetadataLoadingResults, and is able to compute some info from it,
 * and in general provides prettier api for making queries to it.
 */
export default class MetadataBag {
	private sumDurationToIndex: number[] = []
	private readonly results: (MetadataLoadingResult | null)[] = []

	constructor(
		results:
			| (MetadataLoadingResult | null)[]
			| Map<number, MetadataLoadingResult>,
	) {
		if (results instanceof Map) {
			const arr = new Array(results.size)
			arr.fill(null)
			for (const [k, v] of results.entries()) {
				arr[k] = v
			}

			results = arr
		}

		this.results = results

		this.sumDurationToIndex = []
		let sum: number | null = 0
		for (const entry of results) {
			if (entry && entry.type === MetadataLoadingResultType.OK) {
				const { metadata } = entry

				this.sumDurationToIndex.push(sum ?? -1)

				if (typeof sum === "number") {
					if (
						(typeof metadata.duration === "number" ||
							typeof metadata.duration === "bigint") &&
						isFinite(metadata.duration) &&
						metadata.duration >= 0
					) {
						sum += metadata.duration
					} else {
						sum = null
					}
				}
			}
		}
	}

	get length() {
		return this.results.length
	}

	/**
	 * Returns sum duration of all elements to given index.
	 * Returns null if it's not possible.
	 * Index must not be out of bounds and must be positive integer or 0.
	 */
	getDurationToIndex = (i: number, inclusive = false): number | null => {
		let duration = this.sumDurationToIndex[i]
		if (duration < 0) return null
		if (!inclusive) return duration

		const result = this.results[i]
		if (
			result &&
			result.type === MetadataLoadingResultType.OK &&
			typeof result.metadata.duration === "number" &&
			result.metadata.duration >= 0
		) {
			duration += result.metadata.duration
		} else {
			return null
		}

		return duration
	}

	/**
	 * Returns index of entry, which contains specified absolute position.
	 * Returns `this.length` if position is after the end
	 */
	getIndexFromPosition = (position: number): number | null => {
		for (let i = 0; i < this.results.length; i++) {
			const res = this.getDurationToIndex(i, true)
			if (res === null) return null

			if (position <= res) return i
		}

		return this.length
	}
}
