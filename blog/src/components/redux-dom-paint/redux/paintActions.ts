import { createAction, createReducer } from "@reduxjs/toolkit"

import PrimPaintSceneMutation from "@app/components/redux-dom-paint/defines/PrimPaintSceneMutation"
import PaintState from "@app/components/redux-dom-paint/redux/PaintState"
import { PaintToolName } from "@app/components/redux-dom-paint/ui/tool/PaintTool"
import { PathPaintToolOptions } from "@app/components/redux-dom-paint/ui/tool/path"
import { Color } from "@app/util/color"

const actionPrefix = "twsblog/dompaint"

export const setUncommittedMutation =
	createAction<PrimPaintSceneMutation | null>(
		`${actionPrefix}/setUncommittedMutations`,
	)
export const commitMutation = createAction<PrimPaintSceneMutation>(
	`${actionPrefix}/commitMutation`,
)
export const undoCommittedMutation = createAction<void>(
	`${actionPrefix}/undoCommittedMutation`,
)
export const redoUndoneMutation = createAction<void>(
	`${actionPrefix}/redoUndoneMutation`,
)

export const setTool = createAction<PaintToolName>(`${actionPrefix}/setTool`)
export const setInitialMutations = createAction<PrimPaintSceneMutation[]>(
	`${actionPrefix}/setInitialMutations`,
)

export const setRenderSize = createAction<{ width: number; height: number }>(
	`${actionPrefix}/setRenderSize`,
)
export const setSceneSize = createAction<{ width: number; height: number }>(
	`${actionPrefix}/setSceneSize`,
)
export const setSceneOffsets = createAction<[number, number]>(
	`${actionPrefix}/setSceneOffsets`,
)
export const setZoomFactor = createAction<number>(
	`${actionPrefix}/setZoomFactor`,
)
export const setPathPaintToolOptions = createAction<PathPaintToolOptions>(
	`${actionPrefix}/setPathPaintToolOptions`,
)
export const setDrawColor = createAction<Color>(`${actionPrefix}/setDrawColor`)
export const setFillColor = createAction<Color | null>(
	`${actionPrefix}/setFillColor`,
)

const initialPaintState: Readonly<PaintState> = {
	initialMutations: [],
	committedMutations: [],
	uncommittedMutation: null,
	redoStack: [],

	sceneParameters: {
		offsetX: 0,
		offsetY: 0,
		viewportHeight: 1,
		viewportWidth: 1,

		sceneHeight: 4000,
		sceneWidth: 4000,
		zoomFactor: 1,
	},

	// TODO(teawithsand): take care of it in multi-layer setup
	// Layer with index 0 may be removed
	//  and what should happen then?
	//  should it be recreated along with all layers to that index?
	//  that was default in the past...
	//  but it was not compatible with current implementation of reversing mutations
	//  so preferably, always keep at least one layer
	//  and if active was deleted, set ALI to 0th layer
	activeLayerIndex: 0,

	tool: "path",

	uiState: {
		drawColor: [0, 0, 0],
		fillColor: null,
		pathToolOptions: {
			strokeSize: 5,
			lineCapStyle: "round",
			lineJoinStyle: "round",
		},
	},
}

export const createPaintReducer = () =>
	createReducer(initialPaintState, builder => {
		builder
			.addCase(setUncommittedMutation, (state, action) => {
				state.uncommittedMutation = action.payload
			})
			.addCase(commitMutation, (state, action) => {
				state.committedMutations.push(action.payload)
				state.uncommittedMutation = null
				state.redoStack = []
			})
			.addCase(undoCommittedMutation, state => {
				const m = state.committedMutations.pop()
				if (m) {
					state.redoStack.push(m)
				}
			})
			.addCase(redoUndoneMutation, state => {
				const m = state.redoStack.pop()
				if (m) {
					state.committedMutations.push(m)
				}
			})
			.addCase(setInitialMutations, (state, action) => {
				state.initialMutations = action.payload
			})
			.addCase(setTool, (state, action) => {
				state.tool = action.payload
			})
			.addCase(setSceneSize, (state, action) => {
				state.sceneParameters.sceneWidth = action.payload.width
				state.sceneParameters.sceneHeight = action.payload.height
			})
			.addCase(setSceneOffsets, (state, action) => {
				state.sceneParameters.offsetX = action.payload[0]
				state.sceneParameters.offsetY = action.payload[1]
			})
			.addCase(setZoomFactor, (state, action) => {
				state.sceneParameters.zoomFactor = action.payload
			})
			.addCase(setRenderSize, (state, action) => {
				state.sceneParameters.viewportHeight = action.payload.height
				state.sceneParameters.viewportWidth = action.payload.width
			})
			.addCase(setPathPaintToolOptions, (state, action) => {
				state.uiState.pathToolOptions = action.payload
			})
			.addCase(setDrawColor, (state, action) => {
				state.uiState.drawColor = action.payload
			})
			.addCase(setFillColor, (state, action) => {
				state.uiState.fillColor = action.payload
			})
	})
