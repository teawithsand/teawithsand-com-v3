import { useSelector } from "react-redux"

import { PaintScene, PaintToolType } from "@app/domain/paint/defines"
import { PaintState, PaintStateSnapshot } from "@app/domain/paint/redux/state"

/**
 * Typed version of useSelector for PaintState.
 */
export const usePaintSelector = <T>(selector: (state: PaintState) => T) =>
	useSelector(selector)

export const useCurrentPaintSnapshotSelector = <T>(
	selector: (state: PaintStateSnapshot) => T,
) => usePaintSelector(s => selector(s.currentSnapshot))

export const usePaintScene = (): PaintScene =>
	useCurrentPaintSnapshotSelector(s => s.sceneState.scene)

export const useGlobalToolConfig = () =>
	useCurrentPaintSnapshotSelector(s => s.uiState.globalToolConfig)

export const useToolConfig = (toolType: PaintToolType) =>
	useCurrentPaintSnapshotSelector(s => s.uiState.toolsConfig[toolType])

export const useCurrentPaintTool = () =>
	useCurrentPaintSnapshotSelector(s => s.uiState.globalToolConfig.activeTool)
