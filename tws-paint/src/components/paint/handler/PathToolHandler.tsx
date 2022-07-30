import React, { useCallback, useRef } from "react"
import { useDispatch } from "react-redux"

import { useAsRef } from "@app/components/util/useAsRef"
import { PaintElementType, PaintToolType } from "@app/domain/paint/defines"
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
	useCurrentPaintTool,
	usePointOperations,
} from "@app/domain/paint/redux/selector"

import { useSubscribableCallback } from "tws-common/event-bus"
import { Point } from "tws-common/geometry/point"

type State =
	| {
			type: "painting"
			points: number[]
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
			if (tool.current !== PaintToolType.PATH) return
			if (e.type !== PaintEventType.SCREEN) return

			const event = e.screenEvent

			const makeActionFromPoints = (points: number[]): PaintAction => {
				return {
					type: PaintActionType.SCENE_MUTATIONS,
					mutations: [
						{
							type: "push-layer-elements",
							layerIndex: 0,
							elements: [
								{
									type: PaintElementType.SIMPLE_PATH,
									flattenedPoints: points,
									// TODO(teawithsand): read these from config
									stroke: {
										color: [0, 0, 0, 1],
										lineCap: "round",
										lineJoin: "round",
										size: 10,
									},
								},
							],
						},
					],
				}
			}

			const ensureIdleState = (commit = true) => {
				if (
					commit &&
					state.current.type === "painting" &&
					state.current.points.length >= 1
				) {
					dispatch(
						commitPaintActionAndResetUncommitted(
							makeActionFromPoints(state.current.points),
						),
					)
				}

				state.current = {
					type: "idle",
				}
			}

			if (event.type === PaintScreenEventType.POINTER_DOWN) {
				event.event.preventDefault()

				const screenPoint: Point = [
					event.event.clientX,
					event.event.clientY,
				]

				const canvasPoint =
					pointOp.current.screenPointToCanvasPoint(screenPoint)

				ensureIdleState()
				state.current = {
					type: "painting",
					points: [...canvasPoint],
				}
			} else if (event.type === PaintScreenEventType.POINTER_UP) {
				event.event.preventDefault()

				ensureIdleState()
			} else if (event.type === PaintScreenEventType.POINTER_MOVE) {
				event.event.preventDefault()

				const screenPoint: Point = [
					event.event.clientX,
					event.event.clientY,
				]

				const canvasPoint =
					pointOp.current.screenPointToCanvasPoint(screenPoint)

				if (state.current.type !== "painting") return

				state.current.points.push(canvasPoint[0])
				state.current.points.push(canvasPoint[1])

				dispatch(
					setUncommittedPaintActions([
						makeActionFromPoints([...state.current.points]),
					]),
				)
			}
		},
		[pointOp, state],
	)
	useSubscribableCallback(bus, callback)

	return <></>
}
