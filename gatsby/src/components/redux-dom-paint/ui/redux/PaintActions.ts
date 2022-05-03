import { initialPrimPaintScene } from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import PrimPaintSceneMutation, {
	applyMutationOnDraft,
} from "@app/components/redux-dom-paint/defines/PrimPaintSceneMutation"
import { rectNormalize } from "@app/components/redux-dom-paint/primitive/calc"
import PaintState from "@app/components/redux-dom-paint/ui/redux/PaintState"
import { PaintToolName } from "@app/components/redux-dom-paint/ui/tool/PaintTool"
import { createAction, createReducer } from "@reduxjs/toolkit"
import produce, { isDraft, current, original } from "immer"
import { WritableDraft } from "immer/dist/internal"

const actionPrefix = "twsblog/dompaint"

export const setUncommittedMutation =
	createAction<PrimPaintSceneMutation | null>(
		`${actionPrefix}/setUncommittedMutations`
	)
export const commitMutation = createAction<PrimPaintSceneMutation>(
	`${actionPrefix}/commitMutation`
)
export const undoCommittedMutation = createAction<void>(
	`${actionPrefix}/undoCommittedMutation`
)
export const redoUndoneMutation = createAction<void>(
	`${actionPrefix}/redoUndoneMutation`
)
export const setSceneSize = createAction<{ width: number; height: number }>(
	`${actionPrefix}/setSceneSize`
)
export const setTool = createAction<PaintToolName>(`${actionPrefix}/setTool`)
export const setInitialMutations = createAction<PrimPaintSceneMutation[]>(
	`${actionPrefix}/setInitialMutations`
)

const initialPaintState: Readonly<PaintState> = {
	initialMutations: [],
	committedMutations: [],
	uncommittedMutation: null,
	redoStack: [],

	sceneWidth: 4000,
	sceneHeight: 4000,
	screenViewBox: rectNormalize([
		[0, 0],
		[4000, 4000],
	]),

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
			.addCase(setSceneSize, (scene, action) => {
				scene.sceneWidth = action.payload.width
				scene.sceneHeight = action.payload.height
			})
	})
