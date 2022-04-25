import React from "react"
import ImagePaintElement from "../element/impls/ImagePaintElement"
import PathPaintElement from "../element/impls/PathPaintElement"
import PathsPaintElement from "../element/impls/PathsPaintElement"
import PolygonPaintElement from "../element/impls/PolygonPaintElement"
import SimpleCanvasPaintElement from "../element/impls/SimpleCanvasPaintElement"
import PaintElement from "../element/PaintElement"
import ImagePaintDisplayElement from "./impls/ImagePaintDisplayElement"
import PathPaintDisplayElement from "./impls/PathPaintDisplayElement"
import PathsPaintDisplayElement from "./impls/PathsPaintDisplayElement"
import PolygonPaintDisplayElement from "./impls/PolygonPaintDisplayElement"
import SimpleCanvasPaintDisplayElement from "./impls/SimpleCanvasPaintDisplayElement"

export interface PaintDisplayElementProps<T extends PaintElement> {
    element: T,
    zIndex: number,
}

export default (props: PaintDisplayElementProps<PaintElement>) => {
    const { element } = props
    if (element instanceof PathPaintElement) {
        return <PathPaintDisplayElement {...props} element={element} />
    } else if (element instanceof PathsPaintElement) {
        return <PathsPaintDisplayElement {...props} element={element} />
    } else if (element instanceof PolygonPaintElement) {
        return <PolygonPaintDisplayElement {...props} element={element} />
    } else if (element instanceof ImagePaintElement) {
        return <ImagePaintDisplayElement {...props} element={element} />
    } else if (element instanceof SimpleCanvasPaintElement) {
        return <SimpleCanvasPaintDisplayElement {...props} element={element} />
    } else {
        throw new Error(`unsupported element ${element}`)
    }
}
