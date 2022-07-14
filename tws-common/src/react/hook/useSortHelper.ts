import { useState } from "react"
import { arrowDown, arrowUp } from "tws-common/text/unicode"

/**
 * Small hook, which simplifies sorting things in react component.
 */
export const useSortHelper = <T extends string>(defaultSortField?: T) => {
	const [sortField, setSortField] = useState<T | null>(
		defaultSortField ?? null,
	)
	const [sortAsc, setSortAsc] = useState<boolean>(true)

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
				return va.localeCompare(vb)
			} else if (typeof va === "number" && typeof vb === "number") {
				return va - vb
			} else if (typeof va === "bigint" && typeof vb === "bigint") {
				const v = va - vb
				if (v == BigInt(0)) return 0
				else if (v > BigInt(0)) return 1
				else return -1
			} else {
				throw new Error("unreachable code")
			}
		})
	}

	return {
		sortField,
		sortAsc,
		setSortField,

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
