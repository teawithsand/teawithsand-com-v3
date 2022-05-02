import {
	PathLineCapType,
	PathLineJoinType,
} from "@app/components/dom-paint/element/impls/PathPaintElement"
import PaintElement from "@app/components/dom-paint/element/PaintElement"
import PaintScene from "@app/components/dom-paint/element/scene/PaintScene"
import PaintSceneMutation from "@app/components/dom-paint/element/scene/PaintSceneMutation"
import { Color } from "@app/components/dom-paint/primitive"
import { configureStore, createAction, createReducer } from "@reduxjs/toolkit"

export type PaintTool = "scroll" | "path"

export type PaintToolPathState = {
	strokeSize: number
	lineCapStyle: PathLineCapType
	lineJoinStyle: PathLineJoinType
}

/**
 * Contains all settings, which user may have changed during drawing,
 * like color of stroke, fill color, stroke size and so on.
 *
 * Some settings are global, but some are tool-local.
 * As a rule of thumb, tool local settings change when tool is selected and user decides to change some setting.
 */
export type PaintUIState = {
	drawColor: Color
	fillColor: Color | null

	pathToolState: PaintToolPathState
}

export type PaintState = {
	/**
	 * Initial mutations, which can't be undone.
	 */
	initialMutations: PaintSceneMutation[]

	/**
	 * Mutations created by user
	 */
	committedMutations: PaintSceneMutation[]

	/**
	 * Mutations, which were undone using ctrl + z
	 * These reset once some mutations are committed
	 */
	undoneMutations: PaintSceneMutation[]

	/**
	 * Mutations, which are not committed yet, since tool is running
	 * they update often and are not subject of undo operation.
	 */
	uncommittedElements: PaintElement[]
	activeLayerIndex: number

	sceneWidth: number
	sceneHeight: number

	// TODO(teawithsand): add viewbox here(AKA scrolling)
	//  Note: scene position(AKA scrolling) is not managed by redux
	//  instead react reference captures it and processes it on demand

	uiState: PaintUIState

	/**
	 * What tool is used now.
	 */
	tool: PaintTool

	/**
	 * This should not be mutated directly, but
	 * by reducers instead.
	 *
	 * It's computed scene from initial and committed mutations.
	 *
	 * Also please note that it's allowed to be mutated.
	 */
	scene: PaintScene
}

const initialPaintState: Readonly<PaintState> = {
	initialMutations: [],
	committedMutations: [],
	uncommittedElements: [],
	undoneMutations: [],

	sceneWidth: 4000,
	sceneHeight: 4000,

	activeLayerIndex: 0,

	tool: "path",

	uiState: {
		drawColor: [0, 0, 0],
		fillColor: null,
		pathToolState: {
			strokeSize: 5,
			lineCapStyle: "round",
			lineJoinStyle: "round",
		},
	},

	scene: new PaintScene({ layers: [] }),
}

const actionPrefix = "twsblog/dompaint"

export const setUncommittedElements = createAction<PaintElement[]>(
	`${actionPrefix}/setUncommittedElements`
)
export const commitMutation = createAction<PaintSceneMutation>(
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
export const setTool = createAction<PaintTool>(`${actionPrefix}/setTool`)
export const setInitialMutations = createAction<PaintSceneMutation[]>(
	`${actionPrefix}/setInitialMutations`
)

// Please note that in general
//  creating multiple redux stores is anti-pattern
//  but in this case we have 100% separate app, which futhermore
//  may have(at least theoretically) multiple instance running
//  so using multiple stores should be ok here
//
//  Also note that paint is 100% isolated from rest of the app.
//  It will never use gallery redux or something like that.
//  Futhermore, state management for this component is complex enough(unlike gallery's)
//  to implement it as a separate store
//
// TODO(teawithsand): type hinting for this redux store
export const createPaintStore = () =>
	configureStore({
		reducer: createReducer(initialPaintState, builder => {
			builder
				.addCase(setUncommittedElements, (state, action) => {
					state.uncommittedElements = action.payload
				})
				.addCase(commitMutation, (state, action) => {
					state.committedMutations.push(action.payload)
					state.uncommittedElements = []
					state.undoneMutations = []

					state.scene.updateWithMutation(action.payload)
				})
				.addCase(undoCommittedMutation, state => {
					const m = state.committedMutations.pop()
					if (m) {
						state.undoneMutations.push(m)

						const scene = new PaintScene({ layers: [] })
						;[...state.initialMutations, ...state.committedMutations].forEach(
							m => scene.updateWithMutation(m)
						)
						state.scene = scene
					}
				})
				.addCase(redoUndoneMutation, state => {
					const m = state.undoneMutations.pop()
					if (m) {
						state.committedMutations.push(m)

						const scene = new PaintScene({ layers: [] })
						;[...state.initialMutations, ...state.committedMutations].forEach(
							m => scene.updateWithMutation(m)
						)
						state.scene = scene
					}
				})
				.addCase(setInitialMutations, (state, action) => {
					state.initialMutations = action.payload

					const scene = new PaintScene({ layers: [] })
					;[...state.initialMutations, ...state.committedMutations].forEach(m =>
						scene.updateWithMutation(m)
					)
					state.scene = scene
				})
				.addCase(setTool, (state, action) => {
					state.tool = action.payload
				})
				.addCase(setSceneSize, (scene, action) => {
					scene.sceneWidth = action.payload.width
					scene.sceneHeight = action.payload.height
				})
		}),
	})

export const paintSceneSelector = (state: PaintState): PaintScene => {
	return state.scene
}
