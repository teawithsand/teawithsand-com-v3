import { PathLineCapType, PathLineJoinType } from "@app/components/dom-paint/element/impls/PathPaintElement"
import PathToolPanel from "./PathPaintToolPanel"
import usePathTool from "./usePathPaintTool"

export type PathPaintToolOptions = {
	strokeSize: number
	lineCapStyle: PathLineCapType
	lineJoinStyle: PathLineJoinType
}

export { PathToolPanel, usePathTool }
