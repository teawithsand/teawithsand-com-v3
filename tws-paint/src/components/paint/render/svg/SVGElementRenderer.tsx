import React, { memo, useMemo } from "react"

import { PaintElement, PaintElementType } from "@app/domain/paint/defines"

import { encodeColor } from "tws-common/color"

const SimplePathElement = (props: {
	element: PaintElement & { type: PaintElementType.SIMPLE_PATH }
}) => {
	const { element } = props

	const { points, stroke } = element

	const pathString = useMemo(() => {
		return element.points
			.map((v, i) => `${i === 0 ? "M" : "L"} ${v[0]}, ${v[1]}`)
			.join(" ")
	}, [points])

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

	return <path d={pathString} style={style} />
}

const InnerRenderer = (props: { element: PaintElement }) => {
	const { element } = props

	if (element.type === PaintElementType.SIMPLE_PATH) {
		return <SimplePathElement element={element} />
	} else {
		throw new Error(
			`Unsupported element type in svg renderer ${(element as any).type}`,
		)
	}
}

export const SVGElementRenderer = memo(
	InnerRenderer,
	(prevProps, nextProps) => prevProps.element === nextProps.element,
)
