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
			onDragStart={e => e.preventDefault()}
			onClick={props.onClick}
			style={style}
			className={props.className}
		>
			{element.data.text}
		</text>
	)
}

export default TextSVGElementRender
