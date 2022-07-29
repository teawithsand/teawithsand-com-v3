import React, { useCallback, useRef } from "react"
import { useDispatch } from "react-redux"

import { useAsRef } from "@app/components/util/useAsRef"
import { PaintToolType } from "@app/domain/paint/defines"
import { PaintActionType } from "@app/domain/paint/defines/action"
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
} from "@app/domain/paint/redux/selector"

import { useSubscribableCallback } from "tws-common/event-bus"
import { Point } from "tws-common/geometry/point"

type State =
	| {
			type: "moving"
			initialScreenPoint: Point
			lastPoint: Point
			startOffsets: {
				offsetX: number
				offsetY: number
			}
	  }
	| {
			type: "idle"
	  }

export const MoveToolHandler = () => {
	const bus = usePaintEventBus()
	const dispatch = useDispatch()

	const state = useRef<State>({
		type: "idle",
	})

	const offsets = useAsRef(
		useCurrentPaintSnapshotSelector(s => ({
			offsetX: s.sceneState.scene.options.offsetX,
			offsetY: s.sceneState.scene.options.offsetY,
		})),
	)

	const tool = useAsRef(useCurrentPaintTool())

	const callback = useCallback(
		(e: PaintEvent) => {
			if (tool.current !== PaintToolType.MOVE) return
			if (e.type !== PaintEventType.SCREEN) return

			const event = e.screenEvent

			const ensureIdleState = () => {
				state.current = {
					type: "idle",
				}
			}

			if (event.type === PaintScreenEventType.POINTER_DOWN) {
				const screenPoint: Point = [
					event.event.clientX,
					event.event.clientY,
				]

				ensureIdleState()

				state.current = {
					type: "moving",
					initialScreenPoint: screenPoint,
					lastPoint: screenPoint,
					startOffsets: { ...offsets.current },
				}
			} else if (event.type === PaintScreenEventType.POINTER_UP) {
				const screenPoint: Point = [
					event.event.clientX,
					event.event.clientY,
				]

				if (state.current.type !== "moving") return

				state.current.lastPoint = screenPoint

				dispatch(
					commitPaintActionAndResetUncommitted({
						type: PaintActionType.SET_VIEW_OFFSETS,
						offsets: {
							offsetX:
								state.current.startOffsets.offsetX +
								state.current.lastPoint[0] -
								state.current.initialScreenPoint[0],
							offsetY:
								state.current.startOffsets.offsetY +
								state.current.lastPoint[1] -
								state.current.initialScreenPoint[1],
						},
					}),
				)

				ensureIdleState()
			} else if (event.type === PaintScreenEventType.POINTER_MOVE) {
				const screenPoint: Point = [
					event.event.clientX,
					event.event.clientY,
				]

				if (state.current.type !== "moving") return

				state.current.lastPoint = screenPoint

				dispatch(
					setUncommittedPaintActions([
						{
							type: PaintActionType.SET_VIEW_OFFSETS,
							offsets: {
								offsetX:
									state.current.startOffsets.offsetX +
									state.current.lastPoint[0] -
									state.current.initialScreenPoint[0],
								offsetY:
									state.current.startOffsets.offsetY +
									state.current.lastPoint[1] -
									state.current.initialScreenPoint[1],
							},
						},
					]),
				)
			}
		},
		[offsets, state],
	)
	useSubscribableCallback(bus, callback)

	return <></>
}
