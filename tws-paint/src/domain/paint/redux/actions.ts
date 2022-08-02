import { createAction } from "@reduxjs/toolkit"

import { PaintScene } from "@app/domain/paint/defines"
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

export const loadPaintScene = createAction<PaintScene>(
	`${actionPrefix}/loadPaintScene`,
)
