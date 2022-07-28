import { configureStore } from "@reduxjs/toolkit"
import React, { useMemo } from "react"
import { Provider } from "react-redux"
import styled from "styled-components"

import { SVGSceneRenderer } from "@app/components/paint/render/svg/SVGSceneRenderer"
import { SidePanel } from "@app/components/paint/side-panel/SidePanel"
import { PaintActionType } from "@app/domain/paint/defines/action"
import { commitPaintAction, paintStateReducer } from "@app/domain/paint/redux"
import {
	usePaintScene,
	usePresentationDimensions,
} from "@app/domain/paint/redux/selector"

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

	const { width, height } = usePresentationDimensions()

	return (
		<InnerContainer>
			<SidePanel />
			<SVGSceneRenderer
				style={{
					backgroundColor: "white",
				}}
				presentationWidth={width}
				presentationHeight={height}
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
			// Do kind of initial mutation
			// to ensure that layer zero is there
			commitPaintAction({
				type: PaintActionType.SCENE_MUTATIONS,
				mutations: [
					{
						type: "push-layer",
						layer: {
							elements: [],
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
