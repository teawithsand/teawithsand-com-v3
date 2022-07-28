import { createReducer } from "@reduxjs/toolkit"

import { applyMutationOnDraft } from "@app/domain/paint/defines"
import { PaintAction, PaintActionType } from "@app/domain/paint/defines/action"
import {
	commitMutations,
	commitPaintAction,
	noCommitApplyPaintAction,
	redoPaintActions,
	setInitialMutations,
	setUncommittedMutations,
	undoPaintActions,
} from "@app/domain/paint/redux/actions"
import { PaintSceneState, PaintState } from "@app/domain/paint/redux/state"

const recomputeScene = (state: PaintSceneState): void => {
	const mutations = [
		...state.initialMutations,
		...state.committedMutations,
		...state.uncommittedMutations,
	]

	// For now let's go naive
	// No reverse mutations applying here
	state.layers = []
	mutations.forEach(m => applyMutationOnDraft(state, m))
}

const applyPaintAction = (
	state: PaintState,
	action: PaintAction,
	push = true,
): void => {
	// TODO(teawithsand): make this respect max action count

	if (action.type === PaintActionType.SCENE_MUTATIONS) {
		state.sceneState.committedMutations = [
			...state.sceneState.committedMutations,
			...action.mutations,
		]

		recomputeScene(state.sceneState)
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
}

createReducer<PaintState>(
	{
		sceneState: {
			initialMutations: [
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
			committedMutations: [],
			uncommittedMutations: [],
			layers: [],
			options: {
				offsetX: 0,
				offsetY: 0,
				sceneHeight: 0,
				sceneWidth: 0,
			},
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
			.addCase(setInitialMutations, (state, action) => {
				state.sceneState.initialMutations = action.payload
				recomputeScene(state.sceneState)
			})
			.addCase(setUncommittedMutations, (state, action) => {
				state.sceneState.uncommittedMutations = action.payload
				recomputeScene(state.sceneState)
			})
			.addCase(commitMutations, (state, action) => {
				state.sceneState.committedMutations = []

				if (action.payload.length > 0) {
					applyPaintAction(state, {
						type: PaintActionType.SCENE_MUTATIONS,
						mutations: action.payload,
					})
				} else {
					recomputeScene(state.sceneState)
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

				recomputeScene(state.sceneState)
			})
			.addCase(redoPaintActions, (state, action) => {
				for (let i = 0; i < action.payload; i++) {
					const action = state.actionsState.redoStack.pop()
					if (action) state.actionsState.actionsStack.push(action)
					else break
				}

				recomputeScene(state.sceneState)
			}),
)
