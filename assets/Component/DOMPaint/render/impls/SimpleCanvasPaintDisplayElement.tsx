import React, { useContext, useEffect, useRef } from "react"
import SimpleCanvasPaintElement from "../../element/impls/SimpleCanvasPaintElement"
import { PaintDisplayElementProps } from "../PaintDisplayElement"
import { PaintDisplayInfoContext } from "../PaintDisplayInfo"

export default (props: PaintDisplayElementProps<SimpleCanvasPaintElement>) => {
    const { element, zIndex } = props
    const { canvasHeight, canvasWidth } = useContext(PaintDisplayInfoContext)

    const ref = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (ref.current) {
            const ctx = ref.current.getContext("2d")
            if (!ctx) {
                throw new Error("filed to get context")
            }
            element.renderer(ctx)
        }
    }, [element.renderer])

    return <canvas width={canvasWidth} height={canvasHeight} ref={ref} style={{ zIndex }} />
}
