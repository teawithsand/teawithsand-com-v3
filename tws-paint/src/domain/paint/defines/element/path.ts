import { Color } from "tws-common/color"

export type PathLineCapType = "butt" | "square" | "round"
export type PathLineJoinType = "miter" | "round" | "bevel"

export type PathStrokeData = {
	color: Color
	size: number
	lineCap: PathLineCapType
	lineJoin: PathLineJoinType
}

export type PathFillData = {
	color: Color
}

export type HandDrawnPathPaintElement = {
	stroke: PathStrokeData
	// Points as set of pairs of [X, Y] coordinates
	// In other words: flattened list of two dimensional array
	flattenedPoints: number[]
}
