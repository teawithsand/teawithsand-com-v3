import { PaintElement } from "@app/domain/paint/defines/element";

export type PaintLayerOptions = {
	name: string
	isVisible: boolean
	isLocked: boolean
}

export type PaintLayer = {
	options: PaintLayerOptions
	elements: PaintElement[]
}

export type PaintSceneOptions = {
	// User-requested scene parameters
	sceneWidth: number
	sceneHeight: number

	// Offsets used for shifting all elements on scene
    //  Think of it as paint of SVG's view box
    //  Scene can be shrined using width/height and then we can display if's fragment with these props
	offsetX: number
	offsetY: number
}

export type PaintScene = {
	options: PaintSceneOptions
	layers: PaintLayer[]
}