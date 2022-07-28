import { createReducer } from "@reduxjs/toolkit"

import { applyMutationOnDraft } from "@app/domain/paint/defines"
import { PaintAction, PaintActionType } from "@app/domain/paint/defines/action"
import {
	commitMutationsUsingAction,
	commitPaintAction,
	noCommitApplyPaintAction,
	redoPaintActions,
	setUncommittedMutations,
	undoPaintActions,
} from "@app/domain/paint/redux/actions"
import { PaintState } from "@app/domain/paint/redux/state"

const recomputeScene = (state: PaintState): void => {
	const mutations = state.actionsState.actionsStack.flatMap(a => {
		if (a.type === PaintActionType.SCENE_MUTATIONS) {
			return a.mutations
		} else {
			return []
		}
	})

	state.sceneState.currentScene.layers = [...state.sceneState.snapshotLayers]
	mutations.forEach(m =>
		applyMutationOnDraft(state.sceneState.currentScene, m),
	)

	state.sceneState.uncommittedMutations.forEach(m =>
		applyMutationOnDraft(state.sceneState.currentScene, m),
	)
}

const applyPaintAction = (
	state: PaintState,
	action: PaintAction,
	push = true,
): void => {
	// TODO(teawithsand): make this respect max action count

	if (action.type === PaintActionType.SCENE_MUTATIONS) {
		if (!push)
			throw new Error(
				"no-commit actions can't touch mutations, as they have to be applied in-order for ctrl+z to work",
			)
	} else if (action.type === PaintActionType.SET_FILL_COLOR) {
		state.uiState.fillColor = action.color
	} else if (action.type === PaintActionType.SET_STROKE_COLOR) {
		state.uiState.strokeColor = action.color
	} else {
		throw new Error(`Unknown action type: ${(action as any).type}`)
	}

	if (push) {
		if (
			state.actionsState.actionsStack.length >=
			state.actionsState.actionsStackMaxSize
		) {
			const dropoutAction = state.actionsState.actionsStack[0]
			if (dropoutAction.type === PaintActionType.SCENE_MUTATIONS) {
				const tempScene = {
					layers: [...state.sceneState.snapshotLayers],
				}
				dropoutAction.mutations.forEach(m =>
					applyMutationOnDraft(tempScene, m),
				)

				state.sceneState.snapshotLayers = tempScene.layers
			}

			state.actionsState.actionsStack = [
				...state.actionsState.actionsStack.slice(1),
				action,
			]
		} else {
			state.actionsState.actionsStack = [
				...state.actionsState.actionsStack,
				action,
			]
		}

		// quite classic behavior: doing something cancels possibility of doing ctrl + y or ctrl + shift + z
		state.actionsState.redoStack = []
	}

	if (action.type === PaintActionType.SCENE_MUTATIONS) {
		recomputeScene(state)
	}
}

export const paintStateReducer = createReducer<PaintState>(
	{
		sceneState: {
			currentScene: {
				layers: [],
				options: {
					offsetX: 0,
					offsetY: 0,
					sceneHeight: 100,
					sceneWidth: 100,
				},
			},

			snapshotLayers: [],

			uncommittedMutations: [],
		},
		actionsState: {
			actionsStackMaxSize: 200,
			actionsStack: [],
			redoStack: [],
		},
		uiState: {
			activeLayerIndex: 0,
			viewOptions: {
				offsetX: 0,
				offsetY: 0,
				viewportHeight: 0,
				viewportWidth: 0,
				zoomFactor: 1,
			},
			strokeColor: [0, 0, 0, 1],
			fillColor: null,
		},
	},
	// niy for now
	builder =>
		builder
			.addCase(setUncommittedMutations, (state, action) => {
				state.sceneState.uncommittedMutations = action.payload
				recomputeScene(state)
			})
			.addCase(commitMutationsUsingAction, (state, action) => {
				state.sceneState.uncommittedMutations = []

				if (action.payload.length > 0) {
					applyPaintAction(state, {
						type: PaintActionType.SCENE_MUTATIONS,
						mutations: action.payload,
					})
				} else {
					recomputeScene(state)
				}
			})
			.addCase(noCommitApplyPaintAction, (state, action) => {
				applyPaintAction(state, action.payload, false)
			})
			.addCase(commitPaintAction, (state, action) => {
				applyPaintAction(state, action.payload)
			})
			.addCase(undoPaintActions, (state, action) => {
				for (let i = 0; i < action.payload; i++) {
					const action = state.actionsState.actionsStack.pop()
					if (action) state.actionsState.redoStack.push(action)
					else break
				}

				recomputeScene(state)
			})
			.addCase(redoPaintActions, (state, action) => {
				for (let i = 0; i < action.payload; i++) {
					const action = state.actionsState.redoStack.pop()
					if (action) state.actionsState.actionsStack.push(action)
					else break
				}

				recomputeScene(state)
			}),
)
