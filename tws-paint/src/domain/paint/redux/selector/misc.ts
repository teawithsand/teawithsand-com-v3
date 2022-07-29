import { useSelector } from "react-redux"

import { PaintScene, PaintToolType } from "@app/domain/paint/defines"
import { PaintState } from "@app/domain/paint/redux/state"

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

export const useCurrentPaintTool = () =>
	usePaintSelector(s => s.uiState.globalToolConfig.activeTool)
