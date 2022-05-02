import PaintElement from "@app/components/dom-paint/element/PaintElement"
import PaintScene from "@app/components/dom-paint/element/scene/PaintScene"
import PaintSceneMutation from "@app/components/dom-paint/element/scene/PaintSceneMutation"
import PaintState from "@app/components/dom-paint/nui/redux/PaintState"
import { PaintTool } from "@app/components/dom-paint/nui/redux/PrimPaintElement"
import { PrimPaintScene } from "@app/components/dom-paint/nui/redux/PrimPaintScene"

import { configureStore, createAction, createReducer } from "@reduxjs/toolkit"

const initialPaintState: Readonly<PaintState> = {
	initialMutations: [],
	committedMutations: [],
	uncommittedMutations: [],
	redoStack: [],

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
	scene: {
		layers: [],
	},
}


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
				/*
				.addCase(setUncommittedElements, (state, action) => {
					state.uncommittedMutations = action.payload
				})
				.addCase(commitMutation, (state, action) => {
					state.committedMutations.push(action.payload)
					state.uncommittedMutations = []
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
				})*/
		}),
	})

export const paintSceneSelector = (state: PaintState): PrimPaintScene => {
	return state.scene
}
