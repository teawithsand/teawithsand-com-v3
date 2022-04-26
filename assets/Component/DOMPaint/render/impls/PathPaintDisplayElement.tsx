import React, { useContext } from "react"
import PathPaintElement from "../../element/impls/PathPaintElement"
import { renderSvgProps } from "../../element/svg"
import { PaintDisplayElementProps } from "../PaintDisplayElement"
import { PaintDisplayInfoContext } from "../PaintDisplayInfo"

export default (props: PaintDisplayElementProps<PathPaintElement>) => {
    const { element, zIndex } = props
    const { canvasHeight, canvasWidth } = useContext(PaintDisplayInfoContext)

    const style = {
        zIndex,
    }

    let reactElement: React.ReactElement | null = null

    const path = element.points.map((v, i) => {
        if (i === 0) {
            return `M ${v[0]},${v[1]}`
        } else {
            return `L ${v[0]},${v[1]}`
        }
    }).join(" ")

    reactElement = <path
        d={path}
        {...renderSvgProps({
            ...element,
            fill: undefined,
        })}
    />

    return <svg xmlns="http://www.w3.org/2000/svg" width={canvasWidth} height={canvasHeight} style={style}>
        {reactElement}

    </svg>
}
