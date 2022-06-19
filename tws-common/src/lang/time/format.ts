export const formatDurationSeconds = (
	duration: number,
	displayMillis = false,
): string => {
	const originalDuration = duration
	duration = Math.round(duration) // allow only int duration
	let neg = false
	if (duration < 0) {
		duration = -duration
		neg = true
	}

	if (isNaN(duration)) {
		return "n/a"
	}

	if (!isFinite(duration)) {
		if (neg) {
			return "-Inf"
		} else {
			return "Inf"
		}
	}

	const hours = Math.floor(duration / 3600)
	const minutes = Math.floor((duration - hours * 3600) / 60)
	const seconds = duration - hours * 3600 - minutes * 60

	let millisText = ""
	const pad2 = (n: number): string => {
		if (n < 10) return `0${n}`
		else return `${n}`
	}

	const pad3 = (n: number): string => {
		if (n < 10) return `00${n}`
		if (n < 100) return `0${n}`
		else return `${n}`
	}

	if (displayMillis) {
		const millis = Math.round(
			(originalDuration - Math.floor(originalDuration)) * 1000,
		)
		if (millis !== 0) {
			millisText = `.${pad3(millis)}`
		}
	}

	return `${neg ? "-" : ""}${pad2(hours)}:${pad2(minutes)}:${pad2(
		seconds,
	)}${millisText}`
}
