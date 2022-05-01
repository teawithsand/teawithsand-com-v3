import PaintDraw from "@app/components/dom-paint/ui/draw/PaintDraw"
import React from "react"

const PaintPage = () => {
	return (
		<PaintDraw
			initialMutationsLoader={() => [
				{
					type: "push-layer",
					elements: [],
					beforeIndex: 0,
					metadata: {
						isHidden: false,
						name: "layer-0",
					},
				},
			]}
			initialGlobalUIStateLoader={() => ({
				activeLayerIndex: 0,
				fill: null,
				selectedElements: [],
				stroke: {
					color: [0, 0, 0],
					linecap: "round",
					linejoin: "round",
					size: 5,
				},
				uncommittedElements: [],
			})}
		/>
	)
}

export default PaintPage
