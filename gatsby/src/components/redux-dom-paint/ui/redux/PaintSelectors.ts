import {
	PathFillData,
	PathStrokeData,
} from "@app/components/dom-paint/element/impls/PathPaintElement"
import PaintState from "@app/components/redux-dom-paint/ui/redux/PaintState"
import { useSelector } from "react-redux"

/**
 * Typed wrapper over useSelector from react-redux.
 */
export const usePaintStateSelector = <T>(selector: (ps: PaintState) => T) =>
	useSelector<PaintState, T>(selector)

export const usePathStrokeData = (): PathStrokeData =>
	usePaintStateSelector(s => ({
		color: s.uiState.drawColor,
		linecap: s.uiState.pathToolState.lineCapStyle,
		linejoin: s.uiState.pathToolState.lineJoinStyle,
		size: s.uiState.pathToolState.strokeSize,
	}))

export const usePathFillData = (): PathFillData | null =>
	usePaintStateSelector(s =>
		s.uiState.fillColor
			? {
					color: s.uiState.fillColor,
			  }
			: null
	)

// TODO(teawithsand): here add selector for stroke
