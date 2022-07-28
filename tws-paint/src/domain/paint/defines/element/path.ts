import { Color } from "tws-common/color";
import { Point } from "tws-common/geometry/point";


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

export type SimplePathPaintElement = {
	stroke: PathStrokeData
	points: Point[]
}