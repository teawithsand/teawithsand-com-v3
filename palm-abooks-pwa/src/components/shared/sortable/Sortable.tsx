import React, { useCallback, useMemo, useState } from "react"
import { ConnectableElement, useDrag, useDrop } from "react-dnd"

export type SortableItemRenderProps<T> = {
	item: T
	index: number
	isDragging: boolean
	onRef: (element: ConnectableElement) => void
}
export type SortableItemRenderer<T> = React.FC<SortableItemRenderProps<T>>

type DropItem = {
	index: number
}

type ArrayOp =
	| {
			type: "move"
			index: number
			beforeIndex: number
	  }
	| {
			type: "noop"
	  }

const applyArrayOperation = <T,>(array: T[], op: ArrayOp): T[] => {
	if (op.type === "noop") {
		return array
	} else if (op.type === "move") {
		if (op.index === op.beforeIndex) return array
		const newArray = [...array]
		const elem = array[op.index]
		newArray.splice(op.index, 1)
		newArray.splice(op.beforeIndex, 0, elem)

		return newArray
	} else {
		throw new Error("unreachable code")
	}
}

const SortableChild = <T,>(props: {
	item: T
	index: number
	dragAndDropDataIdentifier: string

	render: SortableItemRenderer<T>

	setArrayOperation: (op: ArrayOp) => void
	// Unset currently set operation and performs commit on new one, which causes original data set to change
	commitAndUnsetArrayOperation: (op: ArrayOp | null) => void
}) => {
	const {
		item,
		index,
		dragAndDropDataIdentifier,
		render: Render,
		setArrayOperation,
		commitAndUnsetArrayOperation,
	} = props

	const dropItem: DropItem = useMemo(
		() => ({
			index,
		}),
		[index],
	)

	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: dragAndDropDataIdentifier,
			item: dropItem,
			collect: monitor => ({
				isDragging: monitor.isDragging(),
			}),
			end: (_item, monitor) => {
				const didDrop = monitor.didDrop()
				if (!didDrop) {
					setArrayOperation({
						type: "noop",
					})
				} else {
					commitAndUnsetArrayOperation(null)
				}
			},
		}),
		[
			dragAndDropDataIdentifier,
			dropItem,
			index,
			setArrayOperation,
			commitAndUnsetArrayOperation,
		],
	)

	const [, drop] = useDrop(
		() => ({
			accept: dragAndDropDataIdentifier,
			hover({ index: draggedIndex }: DropItem) {
				if (index !== draggedIndex) {
					setArrayOperation({
						type: "move",
						beforeIndex: index,
						index: draggedIndex,
					})
				}
			},
		}),
		[dragAndDropDataIdentifier, index, setArrayOperation],
	)

	return (
		<Render
			isDragging={isDragging}
			item={item}
			index={index}
			onRef={ref => {
				drop(drag(ref))
			}}
		/>
	)
}

// TODO(teawithsand): fix a bug which makes it impossible to drop dragged element onto place it was taken from

const Sortable = <T,>(props: {
	dragAndDropDataIdentifier: string
	render: SortableItemRenderer<T>
	elements: T[]
	onElementsChange: (newElements: T[]) => void
}) => {
	const { render, elements, onElementsChange, dragAndDropDataIdentifier } =
		props

	const [arrayOp, setArrayOp] = useState<ArrayOp>({
		type: "noop",
	})

	const renderElements = useMemo(
		() =>
			applyArrayOperation(
				elements.map((e, i) => ({
					element: e,
					stableIndex: i,
				})),
				arrayOp,
			),
		[elements, arrayOp],
	)

	const [, drop] = useDrop(() => ({
		accept: dragAndDropDataIdentifier,
	}))

	// TODO(teawithsand): if it's too slow make it independent of arrayOp
	//  use react reference to do that
	const commitArrayOp = useCallback(
		(op: ArrayOp | null) => {
			const newElements = applyArrayOperation(elements, op ?? arrayOp)
			setArrayOp({ type: "noop" })
			onElementsChange(newElements)
		},
		[arrayOp, elements, setArrayOp, onElementsChange],
	)

	const setArrayOperation = useCallback(
		(op: ArrayOp) => {
			setArrayOp(op)
		},
		[setArrayOp],
	)

	// TODO(teawithsand): use keys better than indices
	return (
		<div ref={drop}>
			{renderElements.map(({ element, stableIndex }) => {
				return (
					<SortableChild
						key={stableIndex}
						item={element}
						index={stableIndex}
						dragAndDropDataIdentifier={dragAndDropDataIdentifier}
						render={render}
						commitAndUnsetArrayOperation={commitArrayOp}
						setArrayOperation={setArrayOperation}
					/>
				)
			})}
		</div>
	)
}

export default Sortable
