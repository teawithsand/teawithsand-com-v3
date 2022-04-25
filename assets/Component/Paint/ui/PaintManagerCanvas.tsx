import React, { MutableRefObject, useEffect, useRef } from "react"
import { HTMLCanvasProps } from "../canvas/HTMLCanvas"
import PaintUIInput from "../paint/ui/PaintUIInput"
import PaintUIManager from "../paint/ui/PaintUIManager"
import { Point } from "../primitive"

/**
 * Util component, which draws specified set of elements onto canvas with specified properties.
 */
export default (props: {
    managerFactory: (canvas: HTMLCanvasElement) => PaintUIManager,

    ref?: MutableRefObject<HTMLCanvasElement>,
    style?: React.CSSProperties,
    className?: string,

    onManagerSet?: (manager: PaintUIManager) => void,
    onManagerClose?: (manager: PaintUIManager) => void,
} & HTMLCanvasProps) => {
    const { managerFactory, width, height, className, style, cssWidth, cssHeight, onManagerSet, onManagerClose } = props
    const elementRef = props.ref ?? useRef<HTMLCanvasElement>()

    const managerRef = useRef<PaintUIManager | null>()

    useEffect(() => {
        if (elementRef.current) {
            if (elementRef.current) {
                const manager = managerFactory(elementRef.current)
                managerRef.current = manager

                if (onManagerSet) {
                    onManagerSet(manager)
                }

                return () => {
                    if (onManagerClose) {
                        onManagerClose(manager)
                    }
                    manager.close()
                }
            } else {
                managerRef.current = null
            }
        }
    }, [elementRef.current, managerFactory])


    // TODO(teawithsand): remove copy&paste code from PaintElementCanvas

    const isClickedRef = useRef(false)
    const lastInCanvasPointRef = useRef<Point>([0, 0])

    const onCanvasMouseEvent = (e: PaintUIInput) => {
        if (managerRef.current) {
            managerRef.current.handleInput(e)
        }
    }

    const handlePointerPositionChange = (data: {
        x: number,
        y: number,
    }) => {
        let { x, y } = data

        if (managerRef.current && elementRef.current) {
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