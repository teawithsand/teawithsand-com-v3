import {
	NORM_RECT_MIN,
	rectDimensions,
	rectNormalize,
} from "@app/components/redux-dom-paint/primitive/calc"
import { SVGElementRenderProps } from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"
import React from "react"

export default (props: SVGElementRenderProps<"image">) => {
	const { element } = props

	const normalizedRect = rectNormalize(element.data.rect)
	const { width, height } = rectDimensions(normalizedRect)

	const offsetX = normalizedRect[NORM_RECT_MIN][0]
	const offsetY = normalizedRect[NORM_RECT_MIN][1]

	return (
		<image
			href={element.data.url}
			width={width}
			height={height}
			x={offsetX}
			y={offsetY}
			onDragStart={e => e.preventDefault()}
			onClick={props.onClick}
			className={props.className}
		/>
	)
}
