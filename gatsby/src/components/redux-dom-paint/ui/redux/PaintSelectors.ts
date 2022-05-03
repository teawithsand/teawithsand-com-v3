import {
	PathFillData,
	PathStrokeData,
} from "@app/components/dom-paint/element/impls/PathPaintElement"
import {
	initialPrimPaintScene,
	PrimPaintScene,
} from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import { applyMutationOnDraft } from "@app/components/redux-dom-paint/defines/PrimPaintSceneMutation"
import PaintState from "@app/components/redux-dom-paint/ui/redux/PaintState"
import produce from "immer"
import { useMemo } from "react"
import { useSelector } from "react-redux"

/**
 * Typed wrapper over useSelector from react-redux.
 */
export const usePaintStateSelector = <T>(selector: (ps: PaintState) => T) =>
	useSelector<PaintState, T>(selector)

/**
 * Selector, which does some magic to get scene from paint state.
 * It's computationally expensive, so it's preferably used only once.
 */
export const useSceneSelector = (): PrimPaintScene => {
	const initialMutations = usePaintStateSelector(s => s.initialMutations)
	const committedMutations = usePaintStateSelector(s => s.committedMutations)
	const uncommittedMutation = usePaintStateSelector(
		s => s.uncommittedMutation
	)

	const initialMutationsScene = useMemo(() => {
		const scene = { ...initialPrimPaintScene }
		return produce(scene, draft => {
			for (const m of initialMutations) {
				applyMutationOnDraft(draft, m)
			}
		})
	}, [initialMutations])

	const committedMutationsScene = useMemo(() => {
		return produce(initialMutationsScene, draft => {
			for (const m of committedMutations) {
				applyMutationOnDraft(draft, m)
			}
		})
	}, [initialMutationsScene, committedMutations])

	const finalScene = useMemo(() => {
		if (!uncommittedMutation) {
			return committedMutationsScene
		} else {
			return produce(committedMutationsScene, draft => {
				applyMutationOnDraft(draft, uncommittedMutation)
			})
		}
	}, [committedMutationsScene, uncommittedMutation])

	return {
		...finalScene,
		layers: [...finalScene.layers],
	}
}

export const usePathStrokeData = (): PathStrokeData =>
	usePaintStateSelector(s => ({
		color: s.uiState.drawColor,
		linecap: s.uiState.pathToolOptions.lineCapStyle,
		linejoin: s.uiState.pathToolOptions.lineJoinStyle,
		size: s.uiState.pathToolOptions.strokeSize,
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
