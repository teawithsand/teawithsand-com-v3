import React, { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";



import { useAsRef } from "@app/components/util/useAsRef";
import { PaintToolType } from "@app/domain/paint/defines";
import { PaintActionType } from "@app/domain/paint/defines/action";
import { PaintEvent, PaintEventType, PaintScreenEventType } from "@app/domain/paint/defines/event";
import { usePaintEventBus } from "@app/domain/paint/event";
import { commitPaintAction, noCommitApplyPaintAction } from "@app/domain/paint/redux";
import { useCurrentPaintTool, usePaintSelector } from "@app/domain/paint/redux/selector";



import { useSubscribableCallback } from "tws-common/event-bus";
import { Point } from "tws-common/geometry/point";


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
		usePaintSelector(s => ({
			offsetX: s.sceneState.currentScene.options.offsetX,
			offsetY: s.sceneState.currentScene.options.offsetY,
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
					commitPaintAction({
						type: PaintActionType.SET_VIEW_OFFSETS,
						offsets: {
							offsetX: state.current.startOffsets.offsetX,
							offsetY: state.current.startOffsets.offsetY,
						},
					}),
				)

				dispatch(
					commitPaintAction({
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
					noCommitApplyPaintAction({
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
			}
		},
		[offsets, state],
	)
	useSubscribableCallback(bus, callback)

	return <></>
}