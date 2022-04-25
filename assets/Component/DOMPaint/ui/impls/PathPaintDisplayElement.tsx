import windowed from "@app/util/lang/windowed"
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

    let reactElements: React.ReactElement[] = []

    if (element.points.length >= 2) {
        for (const w of windowed(element.points, 2)) {
            const [s, e] = w

            reactElements.push(
                <line
                    key={Math.random()}
                    x1={s[0]} y1={s[1]} x2={e[0]} y2={e[1]}
                    {...renderSvgProps(element)}
                />
            )
        }
    }

    return <svg xmlns="http://www.w3.org/2000/svg" width={canvasWidth} height={canvasHeight} style={style}>
        {reactElements}
    </svg>
}
