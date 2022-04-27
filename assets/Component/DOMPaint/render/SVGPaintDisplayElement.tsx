import React from "react"
import ImagePaintElement from "../element/impls/ImagePaintElement"
import PathPaintElement from "../element/impls/PathPaintElement"
import PaintElement from "../element/PaintElement"
import { PaintLayerMetadata } from "../element/scene/PaintLayer"
import ImagePaintDisplayElement from "./svgimpls/ImageSVGPaintDisplayElement"
import PathPaintDisplayElement from "./svgimpls/PathSVGPaintDisplayElement"

export default (props: {
    paintElement: PaintElement,
    layerMetadata: PaintLayerMetadata,
}) => {
    const { paintElement } = props

    if (paintElement instanceof PathPaintElement) {
        return <PathPaintDisplayElement {...props} paintElement={paintElement} />
    } else if (paintElement instanceof ImagePaintElement) {
        return <ImagePaintDisplayElement {...props} paintElement={paintElement} />
    } else {
        throw new Error(`unsupported element ${paintElement}`)
    }
}
