import { PrimPaintElement } from "@app/components/redux-dom-paint/defines/PrimPaintElement"
import {
	NORM_RECT_MIN,
	rectDimensions,
	rectNormalize,
} from "@app/components/redux-dom-paint/primitive/calc"
import { SceneRenderProps } from "@app/components/redux-dom-paint/render/SceneRender"
import SVGLayerRender from "@app/components/redux-dom-paint/render/svg/SVGLayerRender"
import React, { Ref, useEffect, useState } from "react"

export type SVGElementRenderProps<T extends string> = {
	element: PrimPaintElement & { type: T }
	onClick?: (e: any) => void
	className?: string
}

export default (
	props: SceneRenderProps & {
		style?: React.CSSProperties
		className?: string
		ref?: Ref<SVGSVGElement>
	}
) => {
	const { scene, width, height, style, className, ref, viewBox } = props

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
			onDrag={(e) => {
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
