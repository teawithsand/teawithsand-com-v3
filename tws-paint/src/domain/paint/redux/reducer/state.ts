import { PaintAction } from "@app/domain/paint/defines/action"
import { applyActionOnPaintStateSnapshot } from "@app/domain/paint/redux/reducer/snapshot"
import { PaintState } from "@app/domain/paint/redux/state"

export const setUncommittedActionsOnPaintState = (
	state: PaintState,
	actions: PaintAction[],
) => {
	state.actionsState.uncommittedActions = actions

	recomputeSnapshotsOnUncommittedActionsChange(state)
}

export const commitActionToActionStackOnPaintState = (
	state: PaintState,
	action: PaintAction,
) => {
	if (
		state.actionsState.actionsStack.length >=
		state.actionsState.actionsStackMaxSize
	) {
		const oldestAction = state.actionsState.actionsStack.shift()
		if (!oldestAction) throw new Error("unreachable code")

		applyActionOnPaintStateSnapshot(state.preActionsSnapshot, oldestAction)
	}

	state.actionsState.actionsStack.push(action)
}

export const recomputeSnapshotsOnUncommittedActionsChange = (
	state: PaintState,
) => {
	state.currentSnapshot = { ...state.preUncommittedSnapshot }

	for (const action of state.actionsState.uncommittedActions) {
		applyActionOnPaintStateSnapshot(state.currentSnapshot, action)
	}
}

export const recomputeSnapshotsOnActionStackChange = (state: PaintState) => {
	state.preUncommittedSnapshot = state.preActionsSnapshot
	for (const action of state.actionsState.actionsStack) {
		applyActionOnPaintStateSnapshot(state.preUncommittedSnapshot, action)
	}

	state.currentSnapshot = { ...state.preUncommittedSnapshot }

	for (const action of state.actionsState.uncommittedActions) {
		applyActionOnPaintStateSnapshot(state.currentSnapshot, action)
	}
}

export const pushUndoStackOntoRootSnapshot = (state: PaintState) => {
	for (const action of state.actionsState.actionsStack) {
		applyActionOnPaintStateSnapshot(state.preActionsSnapshot, action)
	}
	state.actionsState.actionsStack = []

	recomputeSnapshotsOnActionStackChange(state)
}
