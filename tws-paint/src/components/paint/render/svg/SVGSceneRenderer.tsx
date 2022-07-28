import React, { forwardRef, memo, Ref } from "react"

import { SceneRendererProps } from "@app/components/paint/render/SceneRenderer"
import { SVGLayerRenderer } from "@app/components/paint/render/svg/SVGLayerRenderer"

const InnerRenderer = (
	props: SceneRendererProps & {
		style?: React.CSSProperties
		className?: string
	},
	ref: Ref<SVGSVGElement>,
) => {
	const { scene, width, height, style, className } = props

	const { options } = scene

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			style={style}
			className={className}
			ref={ref}
			viewBox={`${options.offsetX} ${options.offsetY} ${options.sceneWidth} ${options.sceneHeight}`}
			onDragStart={e => {
				e.preventDefault()
				return false
			}}
			onDrag={e => {
				e.preventDefault()
				return false
			}}
		>
			{scene.layers.map((e, i) => (
				<SVGLayerRenderer layer={e} key={i} />
			))}
		</svg>
	)
}

export const SVGSceneRenderer = memo(
	forwardRef(InnerRenderer),
	(prevState, nextState) =>
		prevState.scene === nextState.scene && // this one is most likely to change
		prevState.width === nextState.width &&
		prevState.height === nextState.height &&
		prevState.viewBox.every((point, i) =>
			point.every(
				(coordinate, j) => coordinate === nextState.viewBox[i][j],
			),
		),
)
