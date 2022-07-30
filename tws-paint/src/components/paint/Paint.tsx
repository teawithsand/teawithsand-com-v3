import { configureStore } from "@reduxjs/toolkit"
import React, { useMemo } from "react"
import { Helmet } from "react-helmet"
import { Provider } from "react-redux"
import styled from "styled-components"

import { MoveToolHandler } from "@app/components/paint/handler/MoveToolHandler"
import { PathToolHandler } from "@app/components/paint/handler/PathToolHandler"
import { UndoRedoHandler } from "@app/components/paint/handler/UndoRedoHandler"
import { ZoomHandler } from "@app/components/paint/handler/ZoomHandler"
import { PanelDisplay } from "@app/components/paint/panels/panel-display/PanelDisplay"
import { SidePanel } from "@app/components/paint/panels/side-panel/SidePanel"
import {
	drawBackgroundZIndex,
	pointerEventsCaptureZIndex,
} from "@app/components/paint/pantZAxis"
import { SVGSceneRenderer } from "@app/components/paint/render/svg/SVGSceneRenderer"
import { SelectionDisplay } from "@app/components/paint/selection/SelectionDisplay"
import { PaintActionType } from "@app/domain/paint/defines/action"
import {
	PaintEventType,
	PaintScreenEvent,
	PaintScreenEventType,
} from "@app/domain/paint/defines/event"
import {
	PaintEventBusProvider,
	usePaintEventBus,
} from "@app/domain/paint/event"
import {
	commitPaintActionAndResetUncommitted,
	paintStateReducer,
	resetPaintActionsStack,
} from "@app/domain/paint/redux"
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

// Trick not to emit cursor events while we are processing paint's stuff.
const EventContainer = styled.div`
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
`

const Renderer = styled(SVGSceneRenderer)`
	z-index: ${drawBackgroundZIndex};
`

const InnerSelectionDisplay = styled(SelectionDisplay)`
	z-index: ${pointerEventsCaptureZIndex};
`

const InnerPaint = () => {
	const bus = usePaintEventBus()
	const mustOnPaintScreenEvent = (e: PaintScreenEvent) => {
		bus.emitEvent({
			type: PaintEventType.SCREEN,
			screenEvent: e,
		})
	}

	const scene = usePaintScene()

	const { width, height, translateX, translateY } =
		usePresentationDimensions()

	return (
		<InnerContainer>
			<PanelDisplay />
			<SidePanel />
			<EventContainer
				onPointerDown={e => {
					mustOnPaintScreenEvent({
						type: PaintScreenEventType.POINTER_DOWN,
						event: e.nativeEvent,
					})
				}}
				onPointerMove={e => {
					mustOnPaintScreenEvent({
						type: PaintScreenEventType.POINTER_MOVE,
						event: e.nativeEvent,
					})
				}}
				onPointerUp={e => {
					mustOnPaintScreenEvent({
						type: PaintScreenEventType.POINTER_UP,
						event: e.nativeEvent,
					})
				}}
			>
				<InnerSelectionDisplay
					style={{
						transform: `translateX(${translateX}px) translateY(${translateY}px)`,
					}}
				/>
				<Renderer
					style={{
						backgroundColor: "white",
						transform: `translateX(${translateX}px) translateY(${translateY}px)`,
					}}
					presentationWidth={width}
					presentationHeight={height}
					scene={scene}
				/>
			</EventContainer>
		</InnerContainer>
	)
}

export const Paint = () => {
	const store = useMemo(() => {
		const store = configureStore({
			reducer: paintStateReducer,
			middleware: getDefaultMiddleware =>
				getDefaultMiddleware({
					immutableCheck: false,
					serializableCheck: false,
				}),
		})

		store.dispatch(
			// Do kind of initial mutation
			// to ensure that layer zero is there
			commitPaintActionAndResetUncommitted({
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
		store.dispatch(
			// Do kind of initial mutation
			// to ensure that layer zero is there
			commitPaintActionAndResetUncommitted({
				type: PaintActionType.SET_SCENE_DIMENSIONS,
				dimensions: {
					height: 1000,
					width: 1000,
				},
			}),
		)

		store.dispatch(resetPaintActionsStack())

		return store
	}, [])

	return (
		<Provider store={store}>
			<PaintEventBusProvider>
				<Helmet>
					<meta
						name="viewport"
						content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover,shrink-to-fit=no"
					/>
				</Helmet>

				<MoveToolHandler />
				<PathToolHandler />
				<UndoRedoHandler />
				<ZoomHandler />
				<InnerPaint />
			</PaintEventBusProvider>
		</Provider>
	)
}
