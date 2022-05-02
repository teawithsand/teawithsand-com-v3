import PaintSceneMutation from "@app/components/dom-paint/element/scene/PaintSceneMutation"
import { PaintTool, PaintToolPathState } from "@app/components/dom-paint/nui/redux/PrimPaintElement"
import { PrimPaintScene } from "@app/components/dom-paint/nui/redux/PrimPaintScene"
import PrimPaintSceneMutation from "@app/components/dom-paint/nui/redux/PrimPaintSceneMutation"
import { Color } from "@app/components/dom-paint/primitive"


/**
 * Contains all settings, which user may have changed during drawing,
 * like color of stroke, fill color, stroke size and so on.
 *
 * Some settings are global, but some are tool-local.
 * As a rule of thumb, tool local settings change when tool is selected and user decides to change some setting.
 */
export type PaintUIState = {
	drawColor: Color
	fillColor: Color | null

	pathToolState: PaintToolPathState
}

type PaintState = {
	/**
	 * Initial mutations, which can't be undone.
	 */
	initialMutations: PrimPaintSceneMutation[]

	/**
	 * Mutations created by user
	 */
	committedMutations: PrimPaintSceneMutation[]

	/**
	 * Mutations, which were undone using ctrl + z
	 * These reset once some mutations are committed
	 */
	redoStack: PrimPaintSceneMutation[]

	/**
	 * Elements, which are not committed yet, since tool is running
	 * they update often and are not subject of undo operation.
	 */
	uncommittedMutations: PaintSceneMutation[]
	activeLayerIndex: number

	sceneWidth: number
	sceneHeight: number

	// TODO(teawithsand): add viewbox here(AKA scrolling)
	//  Note: scene position(AKA scrolling) is not managed by redux
	//  instead react reference captures it and processes it on demand

	uiState: PaintUIState

	/**
	 * What tool is used now.
	 */
	tool: PaintTool

    /**
     * Scene computed from initial and committed mutations.
     */
    scene: PrimPaintScene,
}

export default PaintState
