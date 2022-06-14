/**
 * Timestamp type, which under the hood is number.
 * It's always integer with ms precision.
 */
export type TimestampMs = number & { readonly s: unique symbol }

export const getNowTimestamp = (): TimestampMs => {
	return Math.round(new Date().getTime()) as TimestampMs
}

export const timestampToDate = (ts: TimestampMs): Date => {
	if (isFinite(ts) || ts < 0)
		throw new Error(`Invalid timestamp to format as date: ${ts}`)
	return new Date(Math.round(ts))
}

export type PerformanceTimestampMs = number & { readonly s: unique symbol }
export const getNowPerformanceTimestamp = (): PerformanceTimestampMs =>
	window.performance.now() as PerformanceTimestampMs
