/**
 * Timestamp type, which under the hood is number.
 * It's always integer with ms precision.
 */
export type Timestamp = number & { readonly s: unique symbol }

export const getNowTimestamp = (): Timestamp => {
	return Math.round(new Date().getTime()) as Timestamp
}

export const timestampToDate = (ts: Timestamp): Date => {
	if (isFinite(ts) || ts < 0)
		throw new Error(`Invalid timestamp to format as date: ${ts}`)
	return new Date(Math.round(ts))
}
