import React, { memo, MouseEvent, useCallback, useMemo } from "react"

import { PaintElement, PaintElementType } from "@app/domain/paint/defines"
import {
	PaintEventType,
	PaintScreenEventType,
} from "@app/domain/paint/defines/event"
import { usePaintEventBus } from "@app/domain/paint/event"

import { encodeColor } from "tws-common/color"

const SimplePathElement = (props: {
	element: PaintElement & { type: PaintElementType.SIMPLE_PATH }
	onClick?: (e: unknown) => void
}) => {
	const { element, onClick } = props

	const { flattenedPoints, stroke } = element

	const pathString = useMemo(() => {
		let res = ""
		for (let i = 0; i < flattenedPoints.length; i += 2) {
			const x = flattenedPoints[i]
			const y = flattenedPoints[i + 1]
			res += `${i === 0 ? "M" : "L"} ${x}, ${y}`
		}
		return res
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

	if (element.type === PaintElementType.SIMPLE_PATH) {
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
