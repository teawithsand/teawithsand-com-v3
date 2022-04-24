import CanvasDrawElement, { CanvasDrawElementProperties } from "../canvas/CanvasDrawElement"

export type PaintStrokeCap = "butt" | "round" | "square"
export type PaintElementProperties = CanvasDrawElementProperties

/**
 * High level paint element, which is created via interaction of user with application
 */
export type PaintElement = CanvasDrawElement

export default PaintElement

// TODO(teawithsand): typed mutations for PaintElements, so we do not always have to redraw each element.