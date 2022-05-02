import { PaintTool } from "@app/components/dom-paint/nui/redux/PrimPaintElement"
import PrimPaintSceneMutation from "@app/components/dom-paint/nui/redux/PrimPaintSceneMutation"
import { createAction } from "@reduxjs/toolkit"

const actionPrefix = "twsblog/dompaint"

export const setUncommittedMutations = createAction<PrimPaintSceneMutation[]>(
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
export const setTool = createAction<PaintTool>(`${actionPrefix}/setTool`)
export const setInitialMutations = createAction<PrimPaintSceneMutation[]>(
	`${actionPrefix}/setInitialMutations`
)
