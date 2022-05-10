import React, { useMemo } from "react"

import { encodeColor } from "@app/components/redux-dom-paint/primitive"
import { SVGElementRenderProps } from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"

/**
 * Note: this renderer renders SVG element.
 */
export default (props: SVGElementRenderProps<"text">) => {
	const { element } = props

	const style = useMemo(() => {
		const res: React.CSSProperties = {}
		res.color = encodeColor(element.data.color)
		res.font = `${element.data.fontSize}px ${element.data.fontName}`
		return res
	}, [element.data])

	return (
		<text
			x={element.data.startPoint[0]}
			y={element.data.startPoint[1]}
			onDragStart={e => e.preventDefault()}
			onClick={props.onClick}
			style={style}
			className={props.className}
		>
			{element.data.text}
		</text>
	)
}
