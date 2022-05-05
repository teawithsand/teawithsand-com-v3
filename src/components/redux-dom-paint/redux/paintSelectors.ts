import {
	PathFillData,
	PathStrokeData,
} from "@app/components/dom-paint/element/impls/PathPaintElement"
import {
	initialPrimPaintScene,
	PrimPaintScene,
} from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import { applyMutationOnDraft } from "@app/components/redux-dom-paint/defines/PrimPaintSceneMutation"
import { rectNormalize } from "@app/components/redux-dom-paint/primitive/calc"
import PaintState from "@app/components/redux-dom-paint/redux/PaintState"
import produce from "immer"
import { useMemo } from "react"
import { useSelector } from "react-redux"

const posOrZero = (n: number) => (n > 0 ? n : 0)

/**
 * Typed wrapper over useSelector from react-redux.
 */
export const usePaintStateSelector = <T>(selector: (ps: PaintState) => T) =>
	useSelector<PaintState, T>(selector)

export const useSceneInfo = () => {
	return usePaintStateSelector(s => {
		const {
			viewportWidth,
			viewportHeight,
			zoomFactor,
			sceneWidth,
			sceneHeight,
			offsetX,
			offsetY,
		} = s.sceneParameters

		const targetViewportWidth = Math.round(viewportWidth / zoomFactor)
		const targetViewportHeight = Math.round(viewportHeight / zoomFactor)

		const viewboxOffsetX = offsetX
		const viewboxOffsetY = offsetY

		const freeSpaceLeftX = posOrZero(-offsetX)
		const freeSpaceTopY = posOrZero(-offsetY)
		if (freeSpaceLeftX || freeSpaceTopY)
			throw new Error("unexpected free space")

		const freeSpaceRightX = posOrZero(
			targetViewportWidth + offsetX - sceneWidth
		)
		const freeSpaceBottomY = posOrZero(
			targetViewportHeight + offsetY - sceneHeight
		)

		const viewboxStartOffsetX = Math.min(
			viewboxOffsetX + freeSpaceLeftX,
			sceneWidth
		)
		const viewboxStartOffsetY = Math.min(
			viewboxOffsetY + freeSpaceTopY,
			sceneHeight
		)

		const freeSpaceRatio = viewportWidth / (viewportWidth + freeSpaceRightX)

		const res = {
			viewportWidth: posOrZero(
				viewportWidth * freeSpaceRatio
			),
			viewportHeight: posOrZero(
				viewportHeight * freeSpaceRatio
			),

			transformX: freeSpaceLeftX,
			transformY: freeSpaceTopY,
			scale: 1, // base zero scale
			viewBox: rectNormalize([
				[viewboxStartOffsetX, viewboxStartOffsetY],
				[
					Math.min(
						sceneWidth,
						Math.max(
							viewboxStartOffsetX,
							targetViewportWidth +
								viewboxStartOffsetX -
								freeSpaceRightX
						)
					),
					Math.min(
						sceneHeight,
						Math.max(
							viewboxStartOffsetY,
							targetViewportHeight +
								viewboxStartOffsetY -
								freeSpaceBottomY
						)
					),
				],
			]),

			// In some cases, canvas has to be 100% hidden
			// then it would be expressed as scale 0, which is not valid
			// hence this parameter
			// hide: false,
			// hide can be expressed by zero width/height viewport
		}

		// console.log("inp", s.sceneParameters, "res", {
		// 	targetViewportHeight,
		// 	targetViewportWidth,
		// 	freeSpaceBottomY,
		// 	freeSpaceTopY,
		// 	freeSpaceLeftX,
		// 	freeSpaceRightX,
		// 	...res,
		// })

		return res
	})
}

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
