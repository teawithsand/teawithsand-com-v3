import SVGSceneRender from "@app/components/redux-dom-paint/render/svg/SVGSceneRender"
import PaintDraw from "@app/components/redux-dom-paint/ui/draw/PaintDraw"
import { generateUUID } from "@app/util/lang/uuid"
import React from "react"

const PaintPage = () => {
	return (
		<SVGSceneRender
			width={4000}
			height={4000}
			scene={{
				layers: [
					{
						id: generateUUID(),
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
				],
			}}
			style={{
				width: "100%",
				height: "100%",
			}}
		/>
	)
}

export default PaintPage
