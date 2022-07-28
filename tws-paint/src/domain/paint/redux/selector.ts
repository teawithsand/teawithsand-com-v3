import { useSelector } from "react-redux"

import { PaintScene } from "@app/domain/paint/defines"
import { PaintState } from "@app/domain/paint/redux/state"

import useWindowDimensions from "tws-common/react/hook/dimensions/useWindowDimensions"

/**
 * Typed version of useSelector for PaintState.
 */
export const usePaintSelector = <T>(selector: (state: PaintState) => T) =>
	useSelector(selector)

export const usePaintScene = (): PaintScene =>
	usePaintSelector(s => s.sceneState.currentScene)

export const usePresentationDimensions = () => {
	const scene = usePaintScene()
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
		}

	const ratioWidth = windowWidth / sceneWidth
	const ratioHeight = windowHeight / sceneHeight

	const ratio = Math.min(ratioWidth, ratioHeight)

	const width = sceneWidth * ratio
	const height = sceneHeight * ratio

	return {
		width,
		height,
	}
}
