import React from "react"
import ImagePaintElement from "../../element/impls/ImagePaintElement"
import { normalizeRect, NORM_RECT_MIN, rectDimensions } from "../../primitive/calc"
import { PaintDisplayElementProps as ImagePaintDisplayElement } from "../PaintDisplayElement"

export default (props: ImagePaintDisplayElement<ImagePaintElement>) => {
    const { element, zIndex } = props

    const normalizedRect = normalizeRect(element.rect)
    const { width, height } = rectDimensions(normalizedRect)

    const offsetX = normalizedRect[NORM_RECT_MIN][0]
    const offsetY = normalizedRect[NORM_RECT_MIN][1]

    return <img
        src={element.url}
        width={width}
        height={height}
        alt={element.url}
        style={{
            zIndex,
            width: `${width}px`,
            height: `${height}px`,
            objectFit: element.objectFit,
            transform: `translate(${offsetX}px, ${offsetY}px)`
        }}
    />
}
