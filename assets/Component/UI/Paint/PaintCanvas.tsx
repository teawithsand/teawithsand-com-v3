import { CanvasDraw } from "@app/util/paint/canvas"
import { DrawableElement } from "@app/util/paint/primitive"
import { DrawSession } from "@app/util/paint/session"
import React, { useEffect, useRef } from "react"

/**
 * Canvas, which has all elements provided printed on it.
 */
export default (props: {
    width: number,
    height: number
    elements: DrawableElement[],
    style?: React.CSSProperties,
    className?: string,
    ref?: React.RefObject<HTMLCanvasElement>,

    onCanvasModified?: (canvas: HTMLCanvasElement) => void,
}) => {
    const { elements, width, height, style, className, onCanvasModified } = props

    const canvasRef = props.ref ?? useRef<HTMLCanvasElement>()
    const drawRef = useRef<CanvasDraw | null>()

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current

            if (!drawRef.current) {
                const context = canvas.getContext('2d')
                const draw = new CanvasDraw(context)
                drawRef.current = draw
            }
            const draw = drawRef.current

            const session = new DrawSession(false)
            draw.drawToSession(session, elements)

            if (onCanvasModified) {
                onCanvasModified(canvas)
            }

            return () => {
                session
                    .finalize()
                    .close()
            }
        }
    }, [elements])

    return <canvas width={width} height={height} ref={canvasRef} style={style} className={className} />
}