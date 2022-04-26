import windowed from "@app/util/lang/windowed"
import React, { useContext } from "react"
import PathsPaintElement from "../../element/impls/PathsPaintElement"
import { renderSvgProps } from "../../element/svg"
import { PaintDisplayElementProps } from "../PaintDisplayElement"
import { PaintDisplayInfoContext } from "../PaintDisplayInfo"

export default (props: PaintDisplayElementProps<PathsPaintElement>) => {
    const { element, zIndex } = props
    const { canvasHeight, canvasWidth } = useContext(PaintDisplayInfoContext)

    const style = {
        zIndex,
    }

    let reactElements: React.ReactElement[] = []

    let i = 0
    for (const p of element.paths) {
        for (const w of windowed(p, 2)) {
            const [s, e] = w
            
            reactElements.push(
                <line
                    key={i}
                    x1={s[0]} y1={s[1]} x2={e[0]} y2={e[1]}
                    {...renderSvgProps(element)}
                />
            )

            i++
        }
    }

    return <svg xmlns="http://www.w3.org/2000/svg" width={canvasWidth} height={canvasHeight} style={style}>
        {reactElements}
    </svg>
}
