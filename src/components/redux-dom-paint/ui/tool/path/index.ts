import { PathLineCapType, PathLineJoinType } from "@app/components/redux-dom-paint/defines/PrimPaintElement"
import PathToolPanel from "./PathPaintToolPanel"
import usePathTool from "./usePathPaintTool"

export type PathPaintToolOptions = {
	strokeSize: number
	lineCapStyle: PathLineCapType
	lineJoinStyle: PathLineJoinType
}

export { PathToolPanel, usePathTool }
