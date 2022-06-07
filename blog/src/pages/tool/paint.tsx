import loadable from "@loadable/component"
import React from "react"

import { generateUUID } from "@app/util/lang/uuid"

const PaintDraw = loadable(
	() => import("@app/components/redux-dom-paint/ui/draw/PaintDraw"),
)

const PaintPage = () => {
	return (
		<main>
			<PaintDraw
				initialMutations={[
					{
						type: "push-layer",
						data: {
							metadata: {
								isHidden: false,
								name: "l1",
							},
							elements: [
								{
									id: generateUUID(),
									type: "path",
									data: {
										entries: [
											{
												type: "M",
												point: [0, 0],
											},
											{
												type: "L",
												point: [1000, 1000],
											},
										],
										fill: null,
										filters: [],
										stroke: {
											color: [0, 0, 0],
											linecap: "round",
											linejoin: "round",
											size: 10,
										},
									},
								},
							],
						},
					},
				]}
			/>
		</main>
	)
}

export default PaintPage
