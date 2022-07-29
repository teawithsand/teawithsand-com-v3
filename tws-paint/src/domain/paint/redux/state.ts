import {
	PaintLayer,
	PaintScene,
	PaintSceneMutation,
	PaintToolsConfig,
	PaintGlobalToolConfig,
	PaintViewOptions,
} from "@app/domain/paint/defines"
import { PaintAction } from "@app/domain/paint/defines/action"

export type PaintSceneState = {
	uncommittedMutations: PaintSceneMutation[]

	snapshotLayers: PaintLayer[]
	currentScene: PaintScene
}

/**
 * This is separate from PaintUIState, as in future PaintUIState may require snapshots in order to handle large amount of actions.
 * If we want to use big stacks of course.
 *
 * Mutations are handled separately, so it's not a problem.
 */
export type PaintActionsState = {
	actionsStackMaxSize: number

	actionsStack: PaintAction[]
	redoStack: PaintAction[]
}

export type PaintUIState = {
	// NIY; tools and stuff here

	viewOptions: PaintViewOptions

	globalToolConfig: PaintGlobalToolConfig
	toolsConfig: PaintToolsConfig
}

export type PaintState = {
	uiState: PaintUIState
	sceneState: PaintSceneState
	actionsState: PaintActionsState

	// there is no such thing as draw state
	// as it's drawer's responsibility, not redux's to handle it.
}
