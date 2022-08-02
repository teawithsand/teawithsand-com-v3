import { createReducer } from "@reduxjs/toolkit"

import {
	commitPaintActionAndResetUncommitted,
	loadPaintScene,
	redoPaintActions,
	resetPaintActionsStack,
	setUncommittedPaintActions,
	undoPaintActions,
} from "@app/domain/paint/redux/actions"
import {
	commitActionToActionStackOnPaintState,
	pushUndoStackOntoRootSnapshot,
	recomputeSnapshotsOnActionStackChange as recomputeSnapshotsOnActionStackChangeOrUncommittedActionsChange,
	setUncommittedActionsOnPaintState,
} from "@app/domain/paint/redux/reducer/state"
import {
	initialPaintStateSnapshot,
	PaintState,
} from "@app/domain/paint/redux/state"

export const paintStateReducer = createReducer<PaintState>(
	{
		actionsState: {
			actionsStackMaxSize: 200,
			actionsStack: [],
			redoStack: [],
			uncommittedActions: [],
		},
		currentSnapshot: initialPaintStateSnapshot,
		preActionsSnapshot: initialPaintStateSnapshot,
		preUncommittedSnapshot: initialPaintStateSnapshot,
	},
	// niy for now
	builder =>
		builder
			.addCase(setUncommittedPaintActions, (state, action) => {
				setUncommittedActionsOnPaintState(state, action.payload)
			})
			.addCase(commitPaintActionAndResetUncommitted, (state, action) => {
				// this is ok as recomputation will be triggered far enough on lower level of snapshots
				state.actionsState.uncommittedActions = []

				commitActionToActionStackOnPaintState(state, action.payload)
				recomputeSnapshotsOnActionStackChangeOrUncommittedActionsChange(
					state,
				)
			})
			.addCase(resetPaintActionsStack, state => {
				pushUndoStackOntoRootSnapshot(state)
			})
			.addCase(undoPaintActions, (state, action) => {
				for (let i = 0; i < action.payload; i++) {
					const action = state.actionsState.actionsStack.pop()
					if (action) state.actionsState.redoStack.push(action)
					else break
				}

				recomputeSnapshotsOnActionStackChangeOrUncommittedActionsChange(
					state,
				)
			})
			.addCase(redoPaintActions, (state, action) => {
				for (let i = 0; i < action.payload; i++) {
					const action = state.actionsState.redoStack.pop()
					if (action) state.actionsState.actionsStack.push(action)
					else break
				}

				recomputeSnapshotsOnActionStackChangeOrUncommittedActionsChange(
					state,
				)
			})
			.addCase(loadPaintScene, (state, action) => {
				pushUndoStackOntoRootSnapshot(state)
				state.preActionsSnapshot.sceneState.scene = action.payload
				recomputeSnapshotsOnActionStackChangeOrUncommittedActionsChange(
					state,
				)
			}),
)
