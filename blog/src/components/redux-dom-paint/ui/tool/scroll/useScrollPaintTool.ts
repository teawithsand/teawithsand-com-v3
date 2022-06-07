import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"

import {
	setSceneOffsets,
	setUncommittedMutation,
} from "@app/components/redux-dom-paint/redux/paintActions"
import { usePaintStateSelector } from "@app/components/redux-dom-paint/redux/paintSelectors"
import DrawEvent from "@app/components/redux-dom-paint/ui/tool/DrawEvent"
import { Point } from "tws-common/geometry"

const useScrollPaintTool = () => {
	const dispatch = useDispatch()
	const lastScreenPointRef = useRef<Point | null>(null)

	// TODO(teawithsand): hook like useSelector, which selects state to ref rather than
	//  to variable. It also shouldn't trigger rerender.
	const fetchedOffsetPoint: Point = usePaintStateSelector(s => [
		s.sceneParameters.offsetX,
		s.sceneParameters.offsetY,
	])
	const currentOffsetPoint = useRef<Point>([0, 0])
	const latestOffsetPoint = useRef<Point>([0, 0])
	latestOffsetPoint.current = fetchedOffsetPoint

	const tool = usePaintStateSelector(s => s.tool)

	const isActive = tool === "scroll"

	const release = () => {
		lastScreenPointRef.current = null
	}

	if (!isActive) {
		release()
	}

	useEffect(() => {
		return () => {
			// make sure no uncommitted mutation on unmount of tool owner
			dispatch(setUncommittedMutation(null))
		}
	}, [])

	return {
		onEvent: (event: DrawEvent) => {
			if (!isActive) return

			if (event.type === "mouse") {
				try {
					if (!lastScreenPointRef.current && event.pressed) {
						lastScreenPointRef.current = event.screenPoint
						currentOffsetPoint.current = latestOffsetPoint.current
					} else if (lastScreenPointRef.current && event.pressed) {
						const offsetX =
							currentOffsetPoint.current[0] +
							lastScreenPointRef.current[0] -
							event.screenPoint[0]
						const offsetY =
							currentOffsetPoint.current[1] +
							lastScreenPointRef.current[1] -
							event.screenPoint[1]

						dispatch(setSceneOffsets([offsetX, offsetY]))
					} else if (lastScreenPointRef.current && !event.pressed) {
						release()
					}
				} finally {
					if (!event.pressed) {
						lastScreenPointRef.current = null
					}
				}
			}
		},
	}
}

export default useScrollPaintTool
