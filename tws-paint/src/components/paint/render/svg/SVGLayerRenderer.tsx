import React, { memo } from "react"

import { SVGElementRenderer } from "@app/components/paint/render/svg/SVGElementRenderer"
import { PaintLayer } from "@app/domain/paint/defines"

const InnerRenderer = (props: { layer: PaintLayer; layerIndex: number }) => {
	const { layer } = props

	return (
		<>
			{layer.elements.map((v, i) => (
				<SVGElementRenderer
					element={v}
					key={i}
					layerIndex={props.layerIndex}
					elementIndex={i}
				/>
			))}
		</>
	)
}

export const SVGLayerRenderer = memo(
	InnerRenderer,
	(prevProps, nextProps) =>
		prevProps.layerIndex === nextProps.layerIndex &&
		prevProps.layer === nextProps.layer,
)
