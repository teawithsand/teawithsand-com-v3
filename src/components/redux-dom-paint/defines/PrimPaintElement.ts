import { ImagePaintElementData } from "@app/components/dom-paint/element/impls/ImagePaintElement"
import { PathPaintElementData } from "@app/components/dom-paint/element/impls/PathPaintElement"
import { TextPaintElementData } from "@app/components/dom-paint/element/impls/TextPaintElement"

export type PrimPaintElement =
	| {
			type: "path"
			id: string
			data: PathPaintElementData
	  }
	| {
			type: "image"
			id: string
			data: ImagePaintElementData
	  }
	| {
			type: "text"
			id: string
			data: TextPaintElementData
	  }
