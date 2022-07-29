import { useSelector } from "react-redux"

import { PaintScene, PaintToolType } from "@app/domain/paint/defines"
import { PaintState } from "@app/domain/paint/redux/state"

import useWindowDimensions from "tws-common/react/hook/dimensions/useWindowDimensions"

/**
 * Typed version of useSelector for PaintState.
 */
export const usePaintSelector = <T>(selector: (state: PaintState) => T) =>
	useSelector(selector)

export const usePaintScene = (): PaintScene =>
	usePaintSelector(s => s.sceneState.currentScene)

export const useGlobalToolConfig = () =>
	usePaintSelector(s => s.uiState.globalToolConfig)
export const useToolConfig = (toolType: PaintToolType) =>
	usePaintSelector(s => s.uiState.toolsConfig[toolType])

export const usePresentationDimensions = () => {
	const scene = usePaintScene()
	const viewOptions = usePaintSelector(s => s.uiState.viewOptions)

	const { height: rawHeight, width: rawWidth } = useWindowDimensions({
		height: 1,
		width: 1,
		orientation: "square",
	})

	const windowHeight = Math.max(rawHeight, 1)
	const windowWidth = Math.max(rawWidth, 1)

	const { sceneHeight, sceneWidth } = scene.options

	if (sceneHeight === 0 || sceneHeight === 0)
		return {
			width: 0,
			height: 0,
			translateX: 0,
			translateY: 0,
		}

	const ratioWidth = windowWidth / sceneWidth
	const ratioHeight = windowHeight / sceneHeight

	const ratio = Math.min(1, Math.min(ratioWidth, ratioHeight))

	const cappedWidth = sceneWidth * ratio
	const cappedHeight = sceneHeight * ratio

	const desiredWidth = cappedWidth * viewOptions.zoomFactor
	const desiredHeight = cappedHeight * viewOptions.zoomFactor

	const width = Math.min(cappedWidth, desiredWidth)
	const height = Math.min(cappedHeight, desiredHeight)

	// This emulates zooming in to the bottom right corner behavior
	const translateX = -(desiredWidth - width)
	const translateY = -(desiredHeight - height)

	return {
		width,
		height,
		translateX,
		translateY,
	}
}
