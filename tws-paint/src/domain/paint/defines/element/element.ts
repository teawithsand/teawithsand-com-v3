import { PaintFilter } from "@app/domain/paint/defines/element/filter"
import { HandDrawnPathPaintElement } from "@app/domain/paint/defines/element/path"
import { TextPaintElement } from "@app/domain/paint/defines/element/text"

export enum PaintElementType {
	HAND_DRAWN_PATH = "hand-drawn-path",
	TEXT = "text",
}

// TODO(teawithsand): create element comparing function

export type PaintElement = (
	| ({
			type: PaintElementType.HAND_DRAWN_PATH
	  } & HandDrawnPathPaintElement)
	| ({
			type: PaintElementType.TEXT
	  } & TextPaintElement)
) & {
	commonOptions: PaintElementCommonOptions
}

export const defaultPaintElementCommonOptions: PaintElementCommonOptions = {
	filters: [],
	visible: true,
	isMarkedForRemoval: false,
}

export type PaintElementCommonOptions = {
	visible?: boolean // defaults to true
	isMarkedForRemoval?: boolean // defaults to false
	filters: PaintFilter[]
}
