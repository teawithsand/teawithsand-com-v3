import React, { useContext } from "react"
import ImagePaintElement from "../../element/ImagePaintElement"
import { normalizeRect, NORM_RECT_MIN, rectDimensions } from "../../primitive/calc"
import { PaintDisplayElementProps as ImagePaintDisplayElement } from "../PaintDisplayElement"
import { PaintDisplayInfoContext } from "../PaintDisplayInfo"

export default (props: ImagePaintDisplayElement<ImagePaintElement>) => {
    const { element, zIndex } = props
    const { canvasHeight, canvasWidth } = useContext(PaintDisplayInfoContext)

    const style = {
        zIndex,
    }

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
