import React from "react"
import ImagePaintElement from "../../element/impls/ImagePaintElement"
import { rectNormalize, NORM_RECT_MIN, rectDimensions } from "../../primitive/calc"
import SVGPaintDisplayElementProps from "./SVGPaintDisplayElementProps"

/**
 * Note: this renderer renders SVG element.
 */
export default (props: SVGPaintDisplayElementProps<ImagePaintElement>) => {
    const { paintElement: element } = props

    const normalizedRect = rectNormalize(element.data.rect)
    const { width, height } = rectDimensions(normalizedRect)

    const offsetX = normalizedRect[NORM_RECT_MIN][0]
    const offsetY = normalizedRect[NORM_RECT_MIN][1]

    return <image
        href={element.data.url}
        width={width}
        height={height}
        x={offsetX}
        y={offsetY}
        onDragStart={(e) => e.preventDefault()}
        onClick={props.onClick}
    />
}
