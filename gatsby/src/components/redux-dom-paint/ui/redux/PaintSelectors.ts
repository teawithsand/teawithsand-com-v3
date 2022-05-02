import PaintState from "@app/components/redux-dom-paint/ui/redux/PaintState"
import { PrimPaintScene } from "@app/components/redux-dom-paint/ui/redux/PrimPaintScene"

export const paintSceneSelector = (state: PaintState): PrimPaintScene => {
	return state.scene
}
