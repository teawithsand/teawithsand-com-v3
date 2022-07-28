import { configureStore } from "@reduxjs/toolkit"
import React, { useMemo } from "react"
import { Provider } from "react-redux"
import styled from "styled-components"

import { SVGSceneRenderer } from "@app/components/paint/render/svg/SVGSceneRenderer"
import { SidePanel } from "@app/components/paint/side-panel/SidePanel"
import { PaintElementType } from "@app/domain/paint/defines"
import { PaintActionType } from "@app/domain/paint/defines/action"
import { commitPaintAction, paintStateReducer } from "@app/domain/paint/redux"
import { usePaintScene } from "@app/domain/paint/redux/selector"

const InnerContainer = styled.div`
	display: grid;

	grid-template-columns: 100vw;
	grid-template-rows: 100vh;
	padding: 0;
	margin: 0;

	overflow: hidden;

	& > * {
		grid-row: 1;
		grid-column: 1;
	}

	background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
		linear-gradient(-45deg, #808080 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, #808080 75%),
		linear-gradient(-45deg, transparent 75%, #808080 75%);
	background-size: 20px 20px;
	background-position: 0 0, 0 10px, 10px -10px, -10px 0px;

	background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% /
		20px 20px;
`

const InnerPaint = () => {
	const scene = usePaintScene()

	return (
		<InnerContainer>
			<SidePanel />
			<SVGSceneRenderer
				style={{
					backgroundColor: "white",
				}}
				presentationHeight={300}
				presentationWidth={300}
				scene={scene}
			/>
		</InnerContainer>
	)
}

export const Paint = () => {
	const store = useMemo(() => {
		const store = configureStore({
			reducer: paintStateReducer,
		})

		store.dispatch(
			commitPaintAction({
				type: PaintActionType.SCENE_MUTATIONS,
				mutations: [
					{
						type: "push-layer",
						layer: {
							elements: [
								{
									type: PaintElementType.SIMPLE_PATH,
									points: [
										[0, 0],
										[50, 10],
										[100, 100],
									],
									stroke: {
										color: [0, 0, 0, 1],
										lineCap: "butt",
										lineJoin: "bevel",
										size: 10,
									},
								},
							],
							options: {
								isLocked: false,
								isVisible: true,
								name: "Layer 0",
							},
						},
					},
				],
			}),
		)

		return store
	}, [])

	return (
		<Provider store={store}>
			<InnerPaint />
		</Provider>
	)
}
