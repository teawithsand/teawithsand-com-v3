import React from "react"
import PaintElement from "../element/PaintElement"
import PathPaintElement from "../element/PathPaintElement"
import PolygonPaintElement from "../element/PolygonPaintElement"
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
    } else {
        throw new Error(`unsupported element ${element}`)
    }
}
