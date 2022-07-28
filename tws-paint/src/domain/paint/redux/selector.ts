import { useSelector } from "react-redux"

import { PaintScene } from "@app/domain/paint/defines"
import { PaintState } from "@app/domain/paint/redux/state"

/**
 * Typed version of useSelector for PaintState.
 */
export const usePaintSelector = <T>(selector: (state: PaintState) => T) =>
	useSelector(selector)

export const usePaintScene = (): PaintScene =>
	usePaintSelector(s => s.sceneState.currentScene)
