import { createReducer } from "@reduxjs/toolkit"

import { PaintState } from "@app/domain/paint/redux/state"

createReducer<PaintState>(
	{
		sceneState: {
			initialMutations: [
				{
					type: "push-layer",
					layer: {
						elements: [],
						options: {
							isLocked: false,
							isVisible: true,
							name: "Layer 0",
						},
					},
				},
			],
			committedMutations: [],
			uncommittedMutations: [],
			layers: [],
			options: {
				offsetX: 0,
				offsetY: 0,
				sceneHeight: 0,
				sceneWidth: 0,
			},
		},
		actionsState: {
			actionsStackMaxSize: 200,
			actionsStack: [],
			redoStack: [],
		},
		uiState: {
			activeLayerIndex: 0,
			viewOptions: {
				offsetX: 0,
				offsetY: 0,
				viewportHeight: 0,
				viewportWidth: 0,
				zoomFactor: 1,
			},
			drawColor: [0, 0, 0, 1],
			fillColor: null,
		},
	},
	// niy for now
	builder => builder,
)
