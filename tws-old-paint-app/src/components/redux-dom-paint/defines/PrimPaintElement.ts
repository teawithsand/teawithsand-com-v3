import { Color } from "tws-common/color"
import { Point, Rect } from "tws-common/geometry"

export type PaintElementData = {
	filters: Array<string>
}

export type ImagePaintElementData = {
	url: string
	rect: Rect
}

export type PathLineCapType = "butt" | "square" | "round"
export type PathLineJoinType = "miter" | "round" | "bevel"

export type PathStrokeData = {
	color: Color
	size: number
	linecap: PathLineCapType
	linejoin: PathLineJoinType
}

export type PathFillData = {
	color: Color
}

export type PathPaintElementEntry =
	| {
			type: "M"
			point: Point
	  }
	| {
			type: "L"
			point: Point
	  }
	| {
			type: "Z"
	  }
export type PathPaintElementData = {
	entries: PathPaintElementEntry[]
	stroke: PathStrokeData
	fill: PathFillData | null
}

export type TextPaintElementData = {
	text: string
	color: Color
	startPoint: Point

	dominantBaseline:
		| "auto"
		| "text-bottom"
		| "alphabetic"
		| "ideographic"
		| "middle"
		| "central"
		| "mathematical"
		| "hanging"
		| "text-top"

	fontName: string
	fontSize: number

	length: number | null
	lengthAdjust: number | null
	glyphRotate: number | null
}

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
