import { PrimPaintElement } from "@app/components/redux-dom-paint/ui/redux/PrimPaintElement"

export type PrimPaintLayerMetadata = {
	isHidden: boolean
	name: string
}

export type PrimPaintLayerData = {
    elements: PrimPaintElement[]
	metadata: PrimPaintLayerMetadata
}

export type PrimPaintLayer = {
	/**
	 * Unique layer id assigned on creation
	 */
	id: string
} & PrimPaintLayerData

export type PrimPaintScene = {
	layers: PrimPaintLayer[]
}

export const initialPrimPaintScene: Readonly<PrimPaintScene> = {
	layers: [],
}
