import React, { MutableRefObject, useEffect, useRef } from "react"
import CanvasDrawElement from "../canvas/CanvasDrawElement"
import HTMLCanvas, { HTMLCanvasProps } from "../canvas/HTMLCanvas"

/**
 * Util component, which draws specified set of elements onto canvas with specified properties.
 */
export default (props: {
    elements: Iterable<CanvasDrawElement>,
    ref?: MutableRefObject<HTMLCanvasElement>,
    style?: React.CSSProperties,
    className?: string,
    onError?: (e: any) => void,
    onDone?: () => void,
} & HTMLCanvasProps) => {
    const { elements, width, height, className, style, cssWidth, cssHeight, onError, onDone } = props
    const elementRef = props.ref ?? useRef<HTMLCanvasElement>()

    useEffect(() => {
        if (elementRef.current) {
            const element = elementRef.current
            const canvasOp = new HTMLCanvas(element)

            canvasOp.reset()
            const result = canvasOp.draw(elements)

            result.donePromise
                .then(() => {
                    if (onDone) onDone()
                })
                .catch((e) => {
                    if (onError) onError(e)
                })

            return () => {
                result.close()
            }
        }
    }, [elements, onDone, onError])

    return <canvas
        width={width}
        height={height}
        ref={elementRef}
        style={{
            width: cssWidth,
            height: cssHeight,
            ...style,
        }}
        className={className} />
}