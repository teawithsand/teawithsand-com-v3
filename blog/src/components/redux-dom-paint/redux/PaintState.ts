import PrimPaintSceneMutation from "@app/components/redux-dom-paint/defines/PrimPaintSceneMutation"
import { PaintToolName } from "@app/components/redux-dom-paint/ui/tool/PaintTool"
import { PathPaintToolOptions } from "@app/components/redux-dom-paint/ui/tool/path"
import { Color } from "tws-common/color"

/**
 * Contains all settings, which user may have changed during drawing,
 * like color of stroke, fill color, stroke size and so on.
 *
 * Some settings are global, but some are tool-local.
 * As a rule of thumb, tool local settings change when tool is selected and user decides to change some setting.
 */
export type PaintStateUI = {
	drawColor: Color
	fillColor: Color | null

	pathToolOptions: PathPaintToolOptions
}

export type PaintStateSceneParameters = {
	// Target render container size. Usually screen size.
	viewportWidth: number
	viewportHeight: number

	// User-requested scene parameters
	sceneWidth: number
	sceneHeight: number

	// Offsets used for user-based canvas dragging
	offsetX: number
	offsetY: number

	zoomFactor: number
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

	sceneParameters: PaintStateSceneParameters

	// TODO(teawithsand): add viewbox here(AKA scrolling)
	//  Note: scene position(AKA scrolling) is not managed by redux
	//  instead react reference captures it and processes it on demand

	uiState: PaintStateUI

	/**
	 * What tool is used now.
	 */
	tool: PaintToolName
}

export default PaintState
