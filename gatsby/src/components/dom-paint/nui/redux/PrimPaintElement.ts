import { ImagePaintElementData } from "@app/components/dom-paint/element/impls/ImagePaintElement"
import {
	PathLineCapType,
	PathLineJoinType,
	PathPaintElementData,
} from "@app/components/dom-paint/element/impls/PathPaintElement"
import { TextPaintElementData } from "@app/components/dom-paint/element/impls/TextPaintElement"

export type PaintTool = "scroll" | "path"

export type PaintToolPathState = {
	strokeSize: number
	lineCapStyle: PathLineCapType
	lineJoinStyle: PathLineJoinType
}

export type PrimPaintElement =
	| {
			type: "path"
			data: PathPaintElementData
	  }
	| {
			type: "image"
			data: ImagePaintElementData
	  }
	| {
			type: "text"
			data: TextPaintElementData
	  }
