/**
 * Takes object and creates type, which has all fields defined and not null or undefined.
 */
export type RecursiveRequired<T> = {
	[P in keyof T]: RecursiveRequired<Required<NonNullable<T[P]>>>
}

/**
 * Noop function, which makes ts accept that T is RecursiveRequired.
 * Also, makes sure that top level value is not null.
 *
 * Useful, when dealing with graphql queries, but may create hard to find bugs.
 */
export const asRequiredRecursively = <T>(
	data: T,
): NonNullable<RecursiveRequired<T>> => {
	const newData = asNonNullable(data)
	return newData as NonNullable<RecursiveRequired<T>>
}

/**
 * Kind of assert, which makes sure that value is not null or undefined.
 * Other falsy values are ok.
 */
export const asNonNullable = <T>(data: T): NonNullable<T> => {
	if (data === undefined || data === null)
		throw new Error("unreachable code - got falsy value to asNonNullable")
	return data as NonNullable<T>
}
