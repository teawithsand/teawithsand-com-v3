import React from "react"

import { PrimPaintLayer } from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import SVGElementRender from "@app/components/redux-dom-paint/render/svg/SVGElementRender"

const SVGLayerRender = (props: { layer: PrimPaintLayer }) => {
	const { layer } = props

	return (
		<>
			{layer.elements.map(e => (
				<SVGElementRender element={e} key={e.id} />
			))}
		</>
	)
}

export default SVGLayerRender
