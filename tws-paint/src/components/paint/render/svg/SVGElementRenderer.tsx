import { getStroke, StrokeOptions } from "perfect-freehand"
import React, { memo, useCallback, useMemo } from "react"

import {
	PaintElement,
	PaintElementType,
	PaintFilterType,
	renderPaintFilters,
} from "@app/domain/paint/defines"
import {
	PaintEventType,
	PaintScreenEventType,
} from "@app/domain/paint/defines/event"
import { usePaintEventBus } from "@app/domain/paint/event"

import { encodeColor } from "tws-common/color"

function getSvgPathFromStroke(stroke: ReturnType<typeof getStroke>) {
	if (!stroke.length) return ""

	const d = stroke.reduce(
		(acc, [x0, y0], i, arr) => {
			const [x1, y1] = arr[(i + 1) % arr.length]
			acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
			return acc
		},
		["M", ...stroke[0], "Q"],
	)

	d.push("Z")
	return d.join(" ")
}

const SimplePathElement = (props: {
	element: PaintElement & { type: PaintElementType.HAND_DRAWN_PATH }
	onClick?: (e: unknown) => void
	onPointerEnter?: (e: unknown) => void
}) => {
	const { element, onPointerEnter, onClick } = props

	const { points, stroke, commonOptions } = element
	const {
		local: {
			removal: { isMarkedForRemoval = false },
		},
		filters,
	} = commonOptions

	const pathString = useMemo(() => {
		const options: StrokeOptions = {
			simulatePressure: true,
			size: stroke.size,
			// Just use sin ease-out, like excalidraw uses
			// It seems to work ok.
			easing: (t: number) => Math.sin((t * Math.PI) / 2),
			last: false,
		}

		return getSvgPathFromStroke(getStroke(points, options))
	}, [points, stroke.size])

	const renderedFilters = useMemo(
		() =>
			renderPaintFilters(
				isMarkedForRemoval
					? [
							...element.commonOptions.filters,
							{
								type: PaintFilterType.OPACITY,
								factor: 0.5,
							},
					  ]
					: element.commonOptions.filters,
			),
		[isMarkedForRemoval, filters],
	)

	const style = useMemo(() => {
		const res: React.CSSProperties = {}

		res.fill = encodeColor(stroke.color)
		res.stroke = encodeColor(stroke.color)
		res.strokeWidth = 1
		res.strokeLinecap = stroke.lineCap
		res.strokeLinejoin = stroke.lineJoin

		return {
			...res,
			...renderedFilters,
		}
	}, [stroke, renderedFilters])

	// skip rendering of invisible elements
	// on bottom most level
	// to prevent loss of useMemoed stuff
	if ((element.commonOptions.visible ?? true) === false) {
		return <></>
	}

	return (
		<path
			onClick={onClick}
			onPointerEnter={onPointerEnter}
			d={pathString}
			style={style}
		/>
	)
}

const InnerRenderer = (props: {
	element: PaintElement
	layerIndex: number
	elementIndex: number
}) => {
	const { element, layerIndex, elementIndex } = props
	const bus = usePaintEventBus()
	const onClick = useCallback(
		(e: unknown) => {
			bus.emitEvent({
				type: PaintEventType.SCREEN,
				screenEvent: {
					type: PaintScreenEventType.ELEMENT_CLICK,
					elementIndex,
					layerIndex,
					event: (e as any).nativeEvent,
				},
			})
		},
		[layerIndex, elementIndex, bus],
	)

	const onPointerEnter = useCallback(
		(e: unknown) => {
			bus.emitEvent({
				type: PaintEventType.SCREEN,
				screenEvent: {
					type: PaintScreenEventType.ELEMENT_POINTER_OVER,
					elementIndex,
					layerIndex,
					event: (e as any).nativeEvent,
				},
			})
		},
		[layerIndex, elementIndex, bus],
	)

	if (element.type === PaintElementType.HAND_DRAWN_PATH) {
		return (
			<SimplePathElement
				onClick={onClick}
				onPointerEnter={onPointerEnter}
				element={element}
			/>
		)
	} else {
		throw new Error(
			`Unsupported element type in svg renderer ${(element as any).type}`,
		)
	}
}

export const SVGElementRenderer = InnerRenderer
