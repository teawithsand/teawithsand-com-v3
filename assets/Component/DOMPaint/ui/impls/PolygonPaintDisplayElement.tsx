import React, { useContext } from "react"
import PolygonPaintElement from "../../element/PolygonPaintElement"
import { renderSvgProps } from "../../element/svg"
import { PaintDisplayElementProps } from "../PaintDisplayElement"
import { PaintDisplayInfoContext } from "../PaintDisplayInfo"

export default (props: PaintDisplayElementProps<PolygonPaintElement>) => {
    const { element, zIndex } = props
    const { canvasHeight, canvasWidth } = useContext(PaintDisplayInfoContext)

    const style = {
        zIndex,
    }

    let elem = null

    if (element.points.length >= 2) {
        if (element.autoClose) {
            elem = <polygon
                points={
                    [...element.points].map(v => `${v[0]},${v[1]}`).join(" ")
                }
                {...renderSvgProps(element)}
            />
        } else {
            elem = <polyline
                points={
                    [...element.points].map(v => `${v[0]},${v[1]}`).join(" ")
                }
                {...renderSvgProps(element)}
            />
        }
    }

    return <svg xmlns="http://www.w3.org/2000/svg" width={canvasWidth} height={canvasHeight} style={style}>
        {elem}
    </svg>
}
