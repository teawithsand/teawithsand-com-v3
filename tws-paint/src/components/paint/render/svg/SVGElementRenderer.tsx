import { getStroke, StrokeOptions } from "perfect-freehand"
import React, { memo, useCallback, useMemo } from "react"

import { PaintElement, PaintElementType } from "@app/domain/paint/defines"
import {
	PaintEventType,
	PaintScreenEventType,
} from "@app/domain/paint/defines/event"
import { usePaintEventBus } from "@app/domain/paint/event"

import { encodeColor } from "tws-common/color"
import { Point } from "tws-common/geometry/point"

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
}) => {
	const { element, onClick } = props

	const { flattenedPoints, stroke } = element

	const pathString = useMemo(() => {
		const options: StrokeOptions = {
			simulatePressure: false,
			size: 1,
			// Just use ease-out sine, like excalidraw uses
			// It seems to work ok.
			easing: (t: number) => Math.sin((t * Math.PI) / 2),
			last: false,
		}

		const points: Point[] = []

		for (let i = 0; i < flattenedPoints.length; i += 2) {
			points.push([flattenedPoints[i], flattenedPoints[i + 1]])
		}

		return getSvgPathFromStroke(getStroke(points, options))
	}, [flattenedPoints])

	const style = useMemo(() => {
		const res: React.CSSProperties = {}

		/*
		if (fill) {
			res.fill = encodeColor(fill.color)
		} else {
			res.fill = "none"
		}
        */

		res.fill = "none"
		res.stroke = encodeColor(stroke.color)
		res.strokeWidth = stroke.size
		res.strokeLinecap = stroke.lineCap
		res.strokeLinejoin = stroke.lineJoin

		return res
	}, [stroke])

	return <path onClick={onClick} d={pathString} style={style} />
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
		[layerIndex, element, bus],
	)

	if (element.type === PaintElementType.HAND_DRAWN_PATH) {
		return <SimplePathElement onClick={onClick} element={element} />
	} else {
		throw new Error(
			`Unsupported element type in svg renderer ${(element as any).type}`,
		)
	}
}

export const SVGElementRenderer = memo(
	InnerRenderer,
	(prevProps, nextProps) =>
		prevProps.element === nextProps.element &&
		prevProps.layerIndex === nextProps.layerIndex &&
		prevProps.elementIndex === nextProps.elementIndex,
)
