import { initialPrimPaintScene } from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import PrimPaintSceneMutation, {
	applyMutationOnDraft,
} from "@app/components/redux-dom-paint/defines/PrimPaintSceneMutation"
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

	scene: {
		layers: [],
	},
	sceneSnapshot: {
		layers: [],
	},
}

// note: for now this implementation stores whole history of mutations
// and does not make use of inverse mutations
// for sake of simplicity

// If big scenes will have too slow undoing
// I'll implement snapshots for limited undo history
//
// No need for inverse mutations
// unless 100% history is needed in big drawings
// which I've decided not to implement.

/*
const mts = [...state.initialMutations, ...state.committedMutations]

let uncommitted = state.uncommittedMutation
if(isDraft(uncommitted)) {
	uncommitted = current(uncommitted)
}

const newScene = produce(initialPrimPaintScene, draft => {
	for (const m of mts) {
		applyMutationOnDraft(draft, m)
	}

	if (uncommitted) {
		applyMutationOnDraft(draft, uncommitted)
	}
})

// state.scene = JSON.parse(JSON.stringify(newScene))
*/

// TODO(teawithsand): move scene computation out of redux
//  and manage is as separate object using react
//  if it's needed in objects down there use some magic to get it there(context/props params)
//  or just write powerful redux selector with useMemos and useRefs for these

const computeSceneSnapshotAndScene = (state: WritableDraft<PaintState>) => {
	// wont be implemented
}

const computeSceneFromSnapshot = (state: WritableDraft<PaintState>) => {
	// wont be implemented
}

export const createPaintReducer = () =>
	createReducer(initialPaintState, builder => {
		builder
			.addCase(setUncommittedMutation, (state, action) => {
				state.uncommittedMutation = action.payload
				computeSceneFromSnapshot(state)
			})
			.addCase(commitMutation, (state, action) => {
				state.committedMutations.push(action.payload)
				state.uncommittedMutation = null
				state.redoStack = []

				computeSceneSnapshotAndScene(state)
			})
			.addCase(undoCommittedMutation, state => {
				const m = state.committedMutations.pop()
				if (m) {
					state.redoStack.push(m)
					computeSceneSnapshotAndScene(state)
				}
			})
			.addCase(redoUndoneMutation, state => {
				const m = state.redoStack.pop()
				if (m) {
					state.committedMutations.push(m)
					computeSceneSnapshotAndScene(state)
				}
			})
			.addCase(setInitialMutations, (state, action) => {
				state.initialMutations = action.payload
				computeSceneSnapshotAndScene(state)
			})
			.addCase(setTool, (state, action) => {
				state.tool = action.payload
			})
			.addCase(setSceneSize, (scene, action) => {
				scene.sceneWidth = action.payload.width
				scene.sceneHeight = action.payload.height
			})
	})
