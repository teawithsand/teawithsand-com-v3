import produce from "immer"
import { useMemo } from "react"
import { useSelector } from "react-redux"

import {
	PathFillData,
	PathStrokeData,
} from "@app/components/redux-dom-paint/defines/PrimPaintElement"
import {
	initialPrimPaintScene,
	PrimPaintScene,
} from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import { applyMutationOnDraft } from "@app/components/redux-dom-paint/defines/PrimPaintSceneMutation"
import PaintState from "@app/components/redux-dom-paint/redux/PaintState"
import {
	Point,
	Rect,
	rectContainsPoint,
	rectIntersection,
	rectNormalize,
	rectTransformDistances,
} from "@app/util/geometry"

const posOrZero = (n: number) => (n > 0 ? n : 0)

/**
 * Typed wrapper over useSelector from react-redux.
 */
export const usePaintStateSelector = <T>(selector: (ps: PaintState) => T) =>
	useSelector<PaintState, T>(selector)

export const useCursorCorrectPos = () => {
	return usePaintStateSelector(s => {
		const { zoomFactor, offsetX, offsetY, viewportWidth, viewportHeight } =
			s.sceneParameters

		const targetViewportWidth = Math.round(viewportWidth / zoomFactor)
		const targetViewportHeight = Math.round(viewportHeight / zoomFactor)

		const desiredViewboxRect = rectNormalize([
			[offsetX, offsetY],
			[offsetX + targetViewportWidth, offsetY + targetViewportHeight],
		])

		return (p: Point): Point | null => {
			const sf = 1 / zoomFactor
			const np: Point = [p[0] * sf + offsetX, p[1] * sf + offsetY]

			const chk = rectContainsPoint(desiredViewboxRect, np)

			console.log(np)

			if (!chk) {
				return null
			}

			return np
		}
	})
}

export const useSceneInfo = () => {
	// Quick note to computation performed here
	// They use somewhat different coordinate system than display one
	//
	// Display/Mouse:
	//(0,0)
	//  |――――――――→ X
	//  |
	//  | image here
	//  ↓
	//  Y
	// Computation:
	//  Y
	//  ↑
	//  |  image here
	//  |
	//  |――――――――→ X
	// (0,0)
	//
	// You should keep that in mind, when using values called top or bottom.
	// X axis is not flipped, hence left and right are still the same.
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

		const desiredViewboxRect = rectNormalize([
			[posOrZero(offsetX), posOrZero(offsetY)],
			[
				posOrZero(offsetX) + targetViewportWidth,
				posOrZero(offsetY) + targetViewportHeight,
			],
		])

		const sceneRect = rectNormalize([
			[0, 0],
			[sceneWidth, sceneHeight],
		])

		const viewBox = rectIntersection(desiredViewboxRect, sceneRect)
		const rectSpaces = rectTransformDistances(sceneRect, desiredViewboxRect)

		const widthFactor =
			sceneWidth / (sceneWidth + posOrZero(rectSpaces.right))
		const heightFactor =
			sceneHeight / (sceneHeight + posOrZero(rectSpaces.top))

		const finalViewportWidth = viewportWidth * widthFactor
		const finalViewportHeight = viewportHeight * heightFactor

		if (!viewBox) {
			return {
				viewportHeight: 0,
				viewportWidth: 0,
				transformX: 0,
				transformY: 0,
				viewBox: [
					[0, 0],
					[0, 0],
				] as Rect,
			}
		}

		return {
			viewportWidth: finalViewportWidth,
			viewportHeight: finalViewportHeight,

			transformX: posOrZero(-offsetX),
			transformY: posOrZero(-offsetY),
			viewBox,
		}
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
		s => s.uncommittedMutation,
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
			: null,
	)

// TODO(teawithsand): here add selector for stroke
