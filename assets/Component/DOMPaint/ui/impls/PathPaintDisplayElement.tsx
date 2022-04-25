import windowed from "@app/util/lang/windowed"
import React, { useContext } from "react"
import PathPaintElement from "../../element/PathPaintElement"
import { encodeColor } from "../../primitive"
import { PaintDisplayElementProps } from "../PaintDisplayElement"
import { PaintDisplayInfoContext } from "../PaintDisplayInfo"

export default (props: PaintDisplayElementProps<PathPaintElement>) => {
    const { element, zIndex } = props
    const { stroke } = element
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
                key={s.map(v => v.toString()).join(';')}
                x1={s[0]} y1={s[1]} x2={e[0]} y2={e[1]} style={{
                    stroke: encodeColor(stroke.color),
                    strokeWidth: stroke.size,
                }} />
            )
        }
    }

    return <svg xmlns="http://www.w3.org/2000/svg" width={canvasWidth} height={canvasHeight} style={style}>
        {reactElements}
    </svg>
}
