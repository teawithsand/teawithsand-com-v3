import PaintDraw from "@app/components/redux-dom-paint/ui/draw/PaintDraw"
import { generateUUID } from "@app/util/lang/uuid"
import React from "react"

const PaintPage = () => {
	return (
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
	)
}

export default PaintPage
