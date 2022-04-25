import React, { MutableRefObject, useEffect, useRef } from "react"
import CanvasDrawElement from "../canvas/CanvasDrawElement"
import HTMLCanvas, { HTMLCanvasProps } from "../canvas/HTMLCanvas"
import PaintUIInput from "../paint/ui/PaintUIInput"
import { Point } from "../primitive"

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

    // Canvas catches only mouse input
    onCanvasMouseEvent?: (event: PaintUIInput & { type: "mouse" }) => void,
} & HTMLCanvasProps) => {
    const { elements, width, height, className, style, cssWidth, cssHeight, onError, onDone, onCanvasMouseEvent } = props
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




    /*
    // This code is ok
    // But there is some throttling which limits emitting events to ~9eps
    // which is bad
    //
    // On the other hand, onPointerMove handler easily gets >40eps
    // which means more precision I guess
    // TODO(teawithsand): debug why it is like this
    const bind = useDrag(({ xy: [x, y], pressed, event }) => {
        if (onCanvasMouseEvent && event && event.currentTarget) {
            const currentTargetRect = (event.currentTarget as HTMLElement).getBoundingClientRect();

            x = x - currentTargetRect.left
            y = y - currentTargetRect.top


            onCanvasMouseEvent({
                type: "mouse",
                x, y, pressed,
                point: [x, y],
            })
        }
    }, {
        threshold: 0,
        delay: 0,
    })
    */


    const isClickedRef = useRef(false)
    const lastInCanvasPointRef = useRef<Point>([0, 0])

    const handlePointerPositionChange = (data: {
        x: number,
        y: number,
    }) => {
        let { x, y } = data

        if (onCanvasMouseEvent && elementRef.current) {
            const bb = (elementRef.current as HTMLElement).getBoundingClientRect()

            x = x - bb.left
            y = y - bb.top

            // ensure our point is in bound of canvas
            if (x < 0 || y < 0 || x > bb.width || y > bb.height) {
                return;
            }

            lastInCanvasPointRef.current = [x, y]

            if (isClickedRef.current) {
                onCanvasMouseEvent({
                    type: "mouse",
                    x, y,
                    pressed: isClickedRef.current,
                    point: [x, y],
                })
            }
        }
    }

    const handleOnPointerUp = () => {
        if (!isClickedRef.current) {
            return;
        }

        isClickedRef.current = false

        const [x, y] = lastInCanvasPointRef.current

        onCanvasMouseEvent({
            type: "mouse",
            pressed: isClickedRef.current,

            x, y,
            point: [x, y],
        })
    }

    const handleOnPointerDown = (data: {
        x: number,
        y: number,
    }) => {
        let { x, y } = data

        if (onCanvasMouseEvent && elementRef.current) {
            const bb = (elementRef.current as HTMLElement).getBoundingClientRect()
            x = x - bb.left
            y = y - bb.top

            lastInCanvasPointRef.current = [x, y]
            isClickedRef.current = true

            onCanvasMouseEvent({
                type: "mouse",
                x, y,
                pressed: isClickedRef.current,
                point: [x, y],
            })
        }
    }

    useEffect(() => {
        if (onCanvasMouseEvent) {
            const cb = (e: any) => {
                const flags = e.buttons !== undefined ? e.buttons : e.which;
                const mouseClicked = (flags & 1) === 1;

                if (!mouseClicked)
                    handleOnPointerUp()
            }

            document.addEventListener("mouseup", cb)
            return () => {
                document.removeEventListener("mouseup", cb)
            }
        }
    }, [onCanvasMouseEvent])

    return <canvas
        onPointerDown={(e) => {
            handleOnPointerDown({
                x: e.clientX,
                y: e.clientY,
            })
        }}
        onPointerUp={() => {
            handleOnPointerUp()
        }}
        onPointerMove={(e) => {
            handlePointerPositionChange({
                x: e.clientX,
                y: e.clientY,
            })
        }}
        width={width}
        height={height}
        ref={elementRef}
        style={{
            touchAction: "none",
            width: cssWidth,
            height: cssHeight,
            ...style,
        }}
        className={className} />
}