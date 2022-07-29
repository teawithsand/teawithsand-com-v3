import { createAction } from "@reduxjs/toolkit"

import { PaintAction } from "@app/domain/paint/defines/action"

import {
	claimId,
	NS_REDUX_ACTION_PREFIX,
} from "tws-common/misc/GlobalIDManager"

const actionPrefix = claimId(NS_REDUX_ACTION_PREFIX, "tws-paint")

export const setUncommittedPaintActions = createAction<PaintAction[]>(
	`${actionPrefix}/setUncommittedPaintActions`,
)

export const commitPaintActionAndResetUncommitted = createAction<PaintAction>(
	`${actionPrefix}/commitPaintActionAndResetUncommitted`,
)

export const resetPaintActionsStack = createAction<void>(
	`${actionPrefix}/resetPaintActionsStack`,
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
