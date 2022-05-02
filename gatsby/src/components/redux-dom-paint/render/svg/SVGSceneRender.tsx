import { PrimPaintElement } from "@app/components/redux-dom-paint/defines/PrimPaintElement"
import { SceneRenderProps } from "@app/components/redux-dom-paint/render/SceneRender"
import SVGLayerRender from "@app/components/redux-dom-paint/render/svg/SVGLayerRender"
import React, { Ref } from "react"

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
	const { scene, width, height, style, className, ref } = props

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			style={style}
			className={className}
			ref={ref}
		>
			{scene.layers.map(e => (
				<SVGLayerRender layer={e} key={e.id} />
			))}
		</svg>
	)
}
