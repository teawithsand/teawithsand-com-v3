import {
	PaintGlobalToolConfig,
	PaintScene,
	PaintSceneMutation,
	PaintToolsConfig,
	PaintToolType,
	PaintViewOptions,
} from "@app/domain/paint/defines"
import { PaintAction } from "@app/domain/paint/defines/action"

export type PaintSceneState = {
	// in future some things
	// about that scene
	// like click element targeting may be implemented
	// so this parent object is left as-is

	scene: PaintScene
}

/**
 * This is separate from PaintUIState, as in future PaintUIState may require snapshots in order to handle large amount of actions.
 * If we want to use big stacks of course.
 *
 * Mutations are handled separately, so it's not a problem.
 */
export type PaintActionsState = {
	uncommittedActions: PaintAction[]

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

export type PaintStateSnapshot = {
	uiState: PaintUIState
	sceneState: PaintSceneState
}

export type PaintState = {
	actionsState: PaintActionsState

	preActionsSnapshot: PaintStateSnapshot
	preUncommittedSnapshot: PaintStateSnapshot
	currentSnapshot: PaintStateSnapshot
}

export const initialPaintStateSnapshot: PaintStateSnapshot = {
	sceneState: {
		scene: {
			layers: [],
			options: {
				offsetX: 0,
				offsetY: 0,
				sceneHeight: 300,
				sceneWidth: 300,
			},
		},
	},
	uiState: {
		globalToolConfig: {
			activeLayerIndex: 0,
			activeTool: PaintToolType.PATH,
			strokeColor: [0, 0, 0, 1],
			fillColor: null,
		},
		toolsConfig: {
			[PaintToolType.MOVE]: {},
			[PaintToolType.PATH]: {
				join: "round",
				stroke: "round",
			},
		},
		viewOptions: {
			offsetX: 0,
			offsetY: 0,
			viewportHeight: 0,
			viewportWidth: 0,
			zoomFactor: 1,
		},
	},
}
