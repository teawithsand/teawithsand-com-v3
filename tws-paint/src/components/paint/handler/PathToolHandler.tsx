import React, { useCallback, useRef } from "react"
import { useDispatch } from "react-redux"

import { PaintElementType, PaintSceneMutation } from "@app/domain/paint/defines"
import {
	PaintEvent,
	PaintEventType,
	PaintScreenEventType,
} from "@app/domain/paint/defines/event"
import { usePaintEventBus } from "@app/domain/paint/event"
import {
	commitMutationsUsingAction,
	setUncommittedMutations,
} from "@app/domain/paint/redux"

import { useSubscribableCallback } from "tws-common/event-bus"
import { Point } from "tws-common/geometry/point"

type State =
	| {
			type: "painting"
			points: Point[]
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

	const callback = useCallback(
		(e: PaintEvent) => {
			if (e.type !== PaintEventType.SCREEN) return

			const event = e.screenEvent

			const makeMutationFromPoints = (
				points: Point[],
			): PaintSceneMutation => {
				return {
					type: "push-layer-elements",
					layerIndex: 0,
					elements: [
						{
							type: PaintElementType.SIMPLE_PATH,
							points: points,
							// TODO(teawithsand): read these from config
							stroke: {
								color: [0, 0, 0, 1],
								lineCap: "round",
								lineJoin: "round",
								size: 10,
							},
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
						commitMutationsUsingAction([
							makeMutationFromPoints(state.current.points),
						]),
					)
				}

				state.current = {
					type: "idle",
				}
			}

			if (event.type === PaintScreenEventType.POINTER_DOWN) {
				ensureIdleState()
				state.current = {
					type: "painting",
					points: [[event.event.clientX, event.event.clientY]],
				}
			} else if (event.type === PaintScreenEventType.POINTER_UP) {
				ensureIdleState()
			} else if (event.type === PaintScreenEventType.POINTER_MOVE) {
				if (state.current.type !== "painting") return

				state.current.points.push([
					event.event.clientX,
					event.event.clientY,
				])
                
				dispatch(
					setUncommittedMutations([
						makeMutationFromPoints([...state.current.points]),
					]),
				)
			}
		},
		[state],
	)
	useSubscribableCallback(bus, callback)

	return <></>
}
