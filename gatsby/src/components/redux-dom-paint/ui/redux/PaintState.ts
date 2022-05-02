import { PrimPaintScene } from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import PrimPaintSceneMutation from "@app/components/redux-dom-paint/defines/PrimPaintSceneMutation"
import { Color } from "@app/components/redux-dom-paint/primitive"
import { PaintToolName } from "@app/components/redux-dom-paint/ui/tool/PaintTool"
import { PathPaintToolOptions } from "@app/components/redux-dom-paint/ui/tool/path"

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

	pathToolOptions: PathPaintToolOptions
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
	 * These are removed once some mutations are committed
	 *
	 * They are already inverted mutations using pre-commit mutation scene.
	 */
	redoStack: PrimPaintSceneMutation[]

	/**
	 * Elements, which are not committed yet, since tool is running
	 * they update often and are not subject of undo operation.
	 */
	uncommittedMutation: PrimPaintSceneMutation | null
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
	tool: PaintToolName

	/**
	 * Scene computed from initial and committed mutations.
	 */
	scene: PrimPaintScene

	/**
	 * Scene without uncommittedMutation applied.
	 */
	sceneSnapshot: PrimPaintScene
}

export default PaintState
