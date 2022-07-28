import { createAction } from "@reduxjs/toolkit";



import { PaintSceneMutation } from "@app/domain/paint/defines";
import { PaintAction } from "@app/domain/paint/defines/action";



import { claimId, NS_REDUX_ACTION_PREFIX } from "tws-common/misc/GlobalIDManager";


const actionPrefix = claimId(NS_REDUX_ACTION_PREFIX, "tws-paint")

export const setUncommittedMutations = createAction<PaintSceneMutation[]>(
	`${actionPrefix}/setUncommittedMutations`,
)

/**
 * Creates and pushes new action, which pushes these mutations to active layer and clears uncommitted mutations.
 */
export const commitMutationsUsingAction = createAction<PaintSceneMutation[]>(
	`${actionPrefix}/commitMutationsUsingAction`,
)

export const noCommitApplyPaintAction = createAction<PaintAction>(
	`${actionPrefix}/noCommitApplyPaintAction`,
)
export const commitPaintAction = createAction<PaintAction>(
	`${actionPrefix}/commitPaintAction`,
)
export const undoPaintActions = createAction<number>(
	`${actionPrefix}/undoPaintActions`,
)
export const redoPaintActions = createAction<number>(
	`${actionPrefix}/redoPaintActions`,
)

// These will be ported to PaintAction
/*
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

export const setDrawColor = createAction<Color>(`${actionPrefix}/setDrawColor`)
export const setFillColor = createAction<Color | null>(
	`${actionPrefix}/setFillColor`,
)

export const setTool = createAction<PaintToolName>(`${actionPrefix}/setTool`)
export const setPathPaintToolOptions = createAction<PathPaintToolOptions>(
	`${actionPrefix}/setPathPaintToolOptions`,
)
*/