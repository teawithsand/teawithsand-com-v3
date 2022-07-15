import { useState } from "react"
import {
	compareBigInt,
	compareNumbers,
	compareStrings,
} from "tws-common/lang/sort"
import { arrowDown, arrowUp } from "tws-common/text/unicode"

/**
 * Small hook, which simplifies sorting things in react component.
 */
export const useSortHelper = <T extends string>(initOptions?: {
	sortField?: T
	sortAsc?: boolean
}) => {
	const [sortField, setSortField] = useState<T | null>(
		initOptions?.sortField ?? null,
	)
	const [sortAsc, setSortAsc] = useState<boolean>(
		initOptions?.sortAsc ?? true,
	)

	const reverseIfRequired = (a: number) => {
		if (!sortAsc) return -a
		return a
	}

	const sortObjectsArrayByCurrentField = <
		V extends string | number | bigint,
		E extends {
			[key in T]: V
		},
	>(
		objects: E[],
	) => {
		if (!sortField) return

		objects.sort((a, b) => {
			const va: V = a[sortField]
			const vb: V = b[sortField]

			if (typeof va !== typeof vb) {
				throw new Error(
					"Object form is inconsistent. All values of sortField has to have same type",
				)
			}

			if (typeof va === "string" && typeof vb === "string") {
				return reverseIfRequired(compareStrings(va, vb))
			} else if (typeof va === "number" && typeof vb === "number") {
				return reverseIfRequired(compareNumbers(va, vb))
			} else if (typeof va === "bigint" && typeof vb === "bigint") {
				return reverseIfRequired(compareBigInt(va, vb))
			} else {
				throw new Error("unreachable code")
			}
		})
	}

	return {
		sortField,
		sortAsc,
		setSortField,

		cacheKey: [sortField, sortAsc],

		reset: () => {
			setSortField(null)
			setSortAsc(true)
		},

		sortIcon: (field: T) => {
			if (field === sortField) {
				return sortAsc ? arrowUp : arrowDown
			}
			return null
		},

		sortCallback: (field: T) => {
			if (sortField === field) {
				setSortAsc(!sortAsc)
			} else {
				setSortAsc(true)
				setSortField(field)
			}
		},

		sortObjectsArrayByCurrentField,

		sortedObjectsArrayByCurrentField: <
			V extends string | number | bigint,
			E extends {
				[key in T]: V
			},
		>(
			objects: Readonly<E[]>,
		): E[] => {
			const cpy = [...objects]
			sortObjectsArrayByCurrentField(cpy)
			return cpy
		},
	}
}
