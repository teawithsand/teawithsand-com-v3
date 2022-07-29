import { PaintSceneMutation } from "@app/domain/paint/defines/mutation";



import { Color } from "tws-common/color";


export enum PaintActionType {
	SCENE_MUTATIONS = "scene-mutations",
	SET_FILL_COLOR = "fill-color",
	SET_STROKE_COLOR = "stroke-color",
	SET_ZOOM = "set-zoom",
	SET_SCENE_DIMENSIONS = "set-scene-dimensions",
	SET_SCENE_OFFSETS = "set-scene-offsets",
}

export type PaintAction =
	| {
			type: PaintActionType.SCENE_MUTATIONS
			mutations: PaintSceneMutation[]
	  }
	| {
			type: PaintActionType.SET_FILL_COLOR
			color: Color | null
	  }
	| {
			type: PaintActionType.SET_STROKE_COLOR
			color: Color
	  }
	| {
			type: PaintActionType.SET_ZOOM
			zoomFactor: number
	  }
	| {
			type: PaintActionType.SET_SCENE_DIMENSIONS
			dimensions: {
				width: number
				height: number
			}
	  }
	| {
			type: PaintActionType.SET_SCENE_OFFSETS
			offsets: {
				offsetX: number
				offsetY: number
			}
	  }