import React from "react"

import { SVGElementRenderProps } from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"

import {
	NORM_RECT_MIN,
	rectDimensions,
	rectNormalize,
} from "tws-common/geometry"

export const ImageSVGElementRender = (
	props: SVGElementRenderProps<"image">,
) => {
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
			onClick={props.onClick}
			className={props.className}
			onDragStart={e => {
				e.preventDefault()
				return false
			}}
			onDrag={e => {
				e.preventDefault()
				return false
			}}
		/>
	)
}

export default ImageSVGElementRender
