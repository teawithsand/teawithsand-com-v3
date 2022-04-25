import React from "react"
import ImagePaintElement from "../element/impls/ImagePaintElement"
import PathPaintElement from "../element/impls/PathPaintElement"
import PolygonPaintElement from "../element/impls/PolygonPaintElement"
import PaintElement from "../element/PaintElement"
import ImagePaintDisplayElement from "./impls/ImagePaintDisplayElement"
import PathPaintDisplayElement from "./impls/PathPaintDisplayElement"
import PolygonPaintDisplayElement from "./impls/PolygonPaintDisplayElement"

export interface PaintDisplayElementProps<T extends PaintElement> {
    element: T,
    zIndex: number,
}

export default (props: PaintDisplayElementProps<PaintElement>) => {
    const { element } = props
    if (element instanceof PathPaintElement) {
        return <PathPaintDisplayElement {...props} element={element} />
    } else if (element instanceof PolygonPaintElement) {
        return <PolygonPaintDisplayElement {...props} element={element} />
    } else if (element instanceof ImagePaintElement) {
        return <ImagePaintDisplayElement {...props} element={element} />
    } else {
        throw new Error(`unsupported element ${element}`)
    }
}
