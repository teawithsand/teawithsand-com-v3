import React, { MutableRefObject } from "react"

import { PrimPaintElement } from "@app/components/redux-dom-paint/defines/PrimPaintElement"
import { SceneRenderProps } from "@app/components/redux-dom-paint/render/SceneRender"
import SVGLayerRender from "@app/components/redux-dom-paint/render/svg/SVGLayerRender"
import {
	NORM_RECT_MIN,
	rectDimensions,
	rectNormalize,
} from "@app/util/geometry"

export type SVGElementRenderProps<T extends string> = {
	element: PrimPaintElement & { type: T }
	onClick?: (e: any) => void
	className?: string
}

const SVGSceneRender = (
	props: SceneRenderProps & {
		style?: React.CSSProperties
		className?: string
		svgElementRef?: MutableRefObject<SVGSVGElement>
	},
) => {
	const {
		scene,
		width,
		height,
		style,
		className,
		svgElementRef: ref,
		viewBox,
	} = props

	const vb = rectNormalize(viewBox)
	const { width: rectWidth, height: rectHeight } = rectDimensions(vb)

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			style={style}
			className={className}
			ref={ref}
			viewBox={`${vb[NORM_RECT_MIN][0]} ${vb[NORM_RECT_MIN][1]} ${rectWidth} ${rectHeight}`}
			onDragStart={e => {
				e.preventDefault()
				return false
			}}
			onDrag={e => {
				e.preventDefault()
				return false
			}}
		>
			{scene.layers.map(e => (
				<SVGLayerRender layer={e} key={e.id} />
			))}
		</svg>
	)
}

export default SVGSceneRender
