import { createReducer } from "@reduxjs/toolkit"

import { PaintState } from "@app/domain/paint/redux/state"

createReducer<PaintState>(
	{
		sceneState: {
			mutations: [],
			layers: [],
			options: {
				offsetX: 0,
				offsetY: 0,
				sceneHeight: 0,
				sceneWidth: 0,
			},
		},
		viewState: {
			offsetX: 0,
			offsetY: 0,
			viewportHeight: 0,
			viewportWidth: 0,
			zoomFactor: 1,
		},
        uiState: {
            
        }
	},
	// niy for now
	builder => builder,
)
