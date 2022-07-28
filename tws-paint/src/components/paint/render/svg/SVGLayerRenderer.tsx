import React, { memo } from "react"

import { SVGElementRenderer } from "@app/components/paint/render/svg/SVGElementRenderer"
import { PaintLayer } from "@app/domain/paint/defines"

const InnerRenderer = (props: { layer: PaintLayer }) => {
	const { layer } = props

	return (
		<>
			{layer.elements.map((v, i) => (
				<SVGElementRenderer element={v} key={i} />
			))}
		</>
	)
}

export const SVGLayerRenderer = memo(
	InnerRenderer,
	(prevProps, nextProps) => prevProps.layer === nextProps.layer,
)
