import { Point } from "@app/Component/DOMPaint/primitive"
import { RefObject, useEffect, useRef } from "react"

export default (
    elementRef: RefObject<HTMLElement>,
    onCanvasMouseEvent: (data: {
        type: "mouse",
        pressed: boolean,
        point: Point,
    }) => void
) => {
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
            point: [x, y],
        })
    }

    const handleOnPointerDown = (data: {
        x: number,
        y: number,
    }) => {
        let { x, y } = data

        if (elementRef.current) {
            const bb = (elementRef.current as HTMLElement).getBoundingClientRect()
            x = x - bb.left
            y = y - bb.top

            lastInCanvasPointRef.current = [x, y]
            isClickedRef.current = true

            onCanvasMouseEvent({
                type: "mouse",
                pressed: isClickedRef.current,
                point: [x, y],
            })
        }
    }

    useEffect(() => {
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
    }, [onCanvasMouseEvent])

    return {
        onPointerDown: (e: any) => {
            handleOnPointerDown({
                x: e.clientX,
                y: e.clientY,
            })
        },

        onPointerUp: () => {
            handleOnPointerUp()
        },

        onPointerMove: (e: any) => {
            handlePointerPositionChange({
                x: e.clientX,
                y: e.clientY,
            })
        },
    }
}