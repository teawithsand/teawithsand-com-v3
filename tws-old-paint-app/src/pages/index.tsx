import PaintDraw from "@app/components/redux-dom-paint/ui/draw/PaintDraw"
import React from "react"

import { generateUUID } from "tws-common/lang/uuid"
import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const IndexPage = () => {
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

export default wrapNoSSR(IndexPage)
