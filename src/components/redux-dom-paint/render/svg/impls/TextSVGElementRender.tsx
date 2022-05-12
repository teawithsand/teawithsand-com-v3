import React, { useMemo } from "react"

import { SVGElementRenderProps } from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"
import { encodeColor } from "@app/util/color"

/**
 * Note: this renderer renders SVG element.
 */
const TextSVGElementRender = (props: SVGElementRenderProps<"text">) => {
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
			onClick={props.onClick}
			style={style}
			className={props.className}
			onDragStart={e => {
				e.preventDefault()
				return false
			}}
			onDrag={e => {
				e.preventDefault()
				return false
			}}
		>
			{element.data.text}
		</text>
	)
}

export default TextSVGElementRender
