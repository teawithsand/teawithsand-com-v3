import { SimplePathPaintElement } from "@app/domain/paint/defines/element/path"
import { TextPaintElement } from "@app/domain/paint/defines/element/text"

export enum PaintElementType {
	SIMPLE_PATH = "simple-path",
	TEXT = "text",
}

export type PaintElement =
	| ({
			type: PaintElementType.SIMPLE_PATH
	  } & SimplePathPaintElement)
	| ({
			type: PaintElementType.TEXT
	  } & TextPaintElement)
