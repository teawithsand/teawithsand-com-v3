import {
	usePaintScene,
	usePaintSelector,
} from "@app/domain/paint/redux/selector/misc"

import { Point } from "tws-common/geometry/point"

export const usePresentationDimensions = () => {
	const scene = usePaintScene()
	const viewOptions = usePaintSelector(s => s.uiState.viewOptions)

	return {
		width: scene.options.sceneWidth * viewOptions.zoomFactor,
		height: scene.options.sceneHeight * viewOptions.zoomFactor,
		translateX: 0,
		translateY: 0,
	}
}

export const usePointOperations = () => {
	const scene = usePaintScene()
	const viewOptions = usePaintSelector(s => s.uiState.viewOptions)
	return {
		screenPointToCanvasPoint: (point: Point): Point => {
			return [
				point[0] / viewOptions.zoomFactor,
				point[1] / viewOptions.zoomFactor,
			]
		},
	}
}
