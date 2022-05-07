import PrimPaintSceneMutation from "@app/components/redux-dom-paint/defines/PrimPaintSceneMutation"
import { Point } from "@app/components/redux-dom-paint/primitive"
import { euclideanDistance } from "@app/components/redux-dom-paint/primitive/calc"
import {
	commitMutation,
	setUncommittedMutation,
} from "@app/components/redux-dom-paint/redux/paintActions"
import {
	usePaintStateSelector,
	usePathFillData,
	usePathStrokeData,
} from "@app/components/redux-dom-paint/redux/paintSelectors"
import DrawEvent from "@app/components/redux-dom-paint/ui/tool/DrawEvent"
import { generateUUID } from "@app/util/lang/uuid"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"

const usePathTool = () => {
	const dispatch = useDispatch()

	const wasPressedRef = useRef(false)
	const pointsRef = useRef<Point[]>([])

	const tool = usePaintStateSelector(s => s.tool)
	const activeLayerIndex = usePaintStateSelector(s => s.activeLayerIndex)

	const strokeData = usePathStrokeData()
	const fillData = usePathFillData()

	const isActive = tool === "path"

	const getMutation = (): PrimPaintSceneMutation => ({
		type: "push-layer-elements",
		elements: [
			{
				type: "path",
				id: generateUUID(),
				data: {
					entries: pointsRef.current.map((v, i) => ({
						type: i === 0 ? "M" : "L",
						point: v,
					})),
					fill: fillData,
					stroke: strokeData,
				},
			},
		],
		layerIndex: activeLayerIndex,
	})

	const release = () => {
		wasPressedRef.current = false
		pointsRef.current = []
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
					if (!wasPressedRef.current && event.pressed) {
						pointsRef.current.push(event.canvasPoint)
						dispatch(setUncommittedMutation(getMutation()))
					} else if (wasPressedRef.current && event.pressed) {
						const lastPoint =
							pointsRef.current[pointsRef.current.length - 1]
						if (
							euclideanDistance(event.canvasPoint, lastPoint) >= 1
						) {
							pointsRef.current.push(event.canvasPoint)
						}

						dispatch(setUncommittedMutation(getMutation()))
					} else if (wasPressedRef.current && !event.pressed) {
						pointsRef.current.push(event.canvasPoint)

						dispatch(commitMutation(getMutation()))

						release()
					}
				} finally {
					wasPressedRef.current = event.pressed
				}
			}
		},
	}
}

export default usePathTool
