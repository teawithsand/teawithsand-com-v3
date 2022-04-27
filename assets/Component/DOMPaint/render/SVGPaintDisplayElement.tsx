import React from "react"
import ImagePaintElement from "../element/impls/ImagePaintElement"
import PathPaintElement from "../element/impls/PathPaintElement"
import TextPaintElement from "../element/impls/TextPaintElement"
import PaintElement from "../element/PaintElement"
import { PaintLayerMetadata } from "../element/scene/PaintLayer"
import ImageSVGPaintDisplayElement from "./svgimpls/ImageSVGPaintDisplayElement"
import PathSVGPaintDisplayElement from "./svgimpls/PathSVGPaintDisplayElement"
import TextSVGPaintDisplayElement from "./svgimpls/TextSVGPaintDisplayElement"

export default (props: {
    paintElement: PaintElement,
    layerMetadata: PaintLayerMetadata,
}) => {
    const { paintElement } = props

    if (paintElement instanceof PathPaintElement) {
        return <PathSVGPaintDisplayElement {...props} paintElement={paintElement} />
    } else if (paintElement instanceof ImagePaintElement) {
        return <ImageSVGPaintDisplayElement {...props} paintElement={paintElement} />
    } else if(paintElement instanceof TextPaintElement) {
        return <TextSVGPaintDisplayElement {...props} paintElement={paintElement} />
    } else {
        throw new Error(`unsupported element ${paintElement}`)
    }
}
