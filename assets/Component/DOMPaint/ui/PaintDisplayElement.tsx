import React from "react"
import PaintElement from "../element/PaintElement"
import PathPaintElement from "../element/PathPaintElement"
import PathDOMPaintElement from "./impls/PathPaintDisplayElement"

export interface PaintDisplayElementProps<T extends PaintElement> {
    element: T,
    zIndex: number,
}

export default (props: PaintDisplayElementProps<PaintElement>) => {
    const { element } = props
    if (element instanceof PathPaintElement) {
        return <PathDOMPaintElement {...props} element={element} />
    }
}
