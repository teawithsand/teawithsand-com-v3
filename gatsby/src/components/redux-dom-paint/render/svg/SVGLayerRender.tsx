import { PrimPaintLayer } from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import SVGElementRender from "@app/components/redux-dom-paint/render/svg/SVGElementRender"

import React from "react"

export default (props: { layer: PrimPaintLayer }) => {
	const { layer } = props

	return (
		<>
			{layer.elements.map(e => (
				<SVGElementRender element={e} key={e.id} />
			))}
		</>
	)
}
