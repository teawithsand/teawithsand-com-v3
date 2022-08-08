import React, { useCallback, useRef } from "react"
import { useDispatch } from "react-redux"

import { useAsRef } from "@app/components/util/useAsRef"
import {
	defaultPaintElementCommonOptions,
	PaintElementType,
	PaintToolType,
} from "@app/domain/paint/defines"
import { PaintAction, PaintActionType } from "@app/domain/paint/defines/action"
import {
	PaintEvent,
	PaintEventType,
	PaintScreenEventType,
} from "@app/domain/paint/defines/event"
import { usePaintEventBus } from "@app/domain/paint/event"
import {
	commitPaintActionAndResetUncommitted,
	setUncommittedPaintActions,
} from "@app/domain/paint/redux"
import {
	useCurrentPaintSnapshotSelector,
	useCurrentPaintTool,
	usePointOperations,
} from "@app/domain/paint/redux/selector"

import { useSubscribableCallback } from "tws-common/event-bus"
import { Point } from "tws-common/geometry/point"

type State =
	| {
			type: "painting"
			points: Point[]
			enteredZeroPressure: boolean
	  }
	| {
			type: "idle"
	  }

export const PathToolHandler = () => {
	const bus = usePaintEventBus()
	const dispatch = useDispatch()

	const state = useRef<State>({
		type: "idle",
	})

	const pointOp = useAsRef(usePointOperations())

	const tool = useAsRef(useCurrentPaintTool())

	const callback = useCallback(
		(e: PaintEvent) => {
			if (e.type !== PaintEventType.SCREEN) return

			// TODO(teawithsand): handle events from scaling and modify elements appropriately
		},
		[pointOp, state],
	)
	useSubscribableCallback(bus, callback)

	return <></>
}
