// TODO(teawithsand): implement generic sortable element, which allows dnd-based sorting of every possible type of stuff
// See: https://codesandbox.io/s/github/react-dnd/react-dnd/tree/gh-pages/examples_ts/04-sortable/cancel-on-drop-outside?from-embed=&file=/src/Card.tsx
// https://react-dnd.github.io/react-dnd/examples/sortable/cancel-on-drop-outside
/*
import React, { ReactElement, ReactFragment, RefObject, useMemo } from "react"

import { generateUUID } from "tws-common/lang/uuid"

export type SortableElementRenderProps<T> = {
	element: T
	index: number
	onRef: <E extends RefObject<any>>(element: E) => E
}

type DropItem = {
	id: string
	index: number
}

const SortableChild = <T,>(props: {
	dropId: string
	render: (
		props: SortableElementRenderProps<T>,
	) => ReactFragment | ReactElement
	element: T
	onElementsChange: (newElements: T[]) => void
}) => {
    return props.render({
        element: e,
        index: i,
        onRef: ref => {
            return ref
        },
    })
}

const Sortable = <T,>(props: {
	dropId: string
	render: (
		props: SortableElementRenderProps<T>,
	) => ReactFragment | ReactElement
	elements: T[]
	onElementsChange: (newElements: T[]) => void
}) => {
	const { render, elements, onElementsChange } = props

	const identifiedElements = useMemo(
		() =>
			elements.map((element, index) => ({
				element,
				index,
				id: generateUUID(),
			})),
		[elements],
	)

	return (
		<>
			{elements.map((e, i) => {
				return render({
					element: e,
					index: i,
					onRef: ref => {
						return ref
					},
				})
			})}
		</>
	)
}

export default Sortable

*/
