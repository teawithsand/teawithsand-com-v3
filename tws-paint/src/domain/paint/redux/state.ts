import {
	PaintScene,
	PaintSceneMutation,
	PaintViewOptions,
} from "@app/domain/paint/defines"

export type PaintSceneState = {
	mutations: PaintSceneMutation[]
} & PaintScene

export type PaintViewState = PaintViewOptions

export type PaintUIState = {
	// NIY; tools and stuff here
}

export type PaintState = {
	uiState: PaintUIState
	sceneState: PaintSceneState
	viewState: PaintViewState

	// there is no such thing as draw state
	// as it's drawer's responsibility, not redux's to handle it.
}
