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

    const fixCoordinates = (p: Point): Point => {
        const bb = (elementRef.current as HTMLElement).getBoundingClientRect()

        return [
            p[0] - bb.left + elementRef.current.scrollLeft,
            p[1] - bb.top + elementRef.current.scrollTop,
        ]
    }

    const handlePointerPositionChange = (data: {
        x: number,
        y: number,
    }) => {
        let { x: xxxxxx, y: yyyyyy } = data
        let p: Point = [xxxxxx, yyyyyy]

        if (onCanvasMouseEvent && elementRef.current) {
            const bb = (elementRef.current as HTMLElement).getBoundingClientRect()
            // ensure our point is in bound of canvas
            if (xxxxxx < 0 || yyyyyy < 0 || xxxxxx > bb.width || yyyyyy > bb.height) {
                return;
            }

            p = fixCoordinates(p)

            lastInCanvasPointRef.current = p

            if (isClickedRef.current) {
                onCanvasMouseEvent({
                    type: "mouse",
                    pressed: isClickedRef.current,
                    point: p,
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
        let { x: xxxxxx, y: yyyyyy } = data
        let p: Point = [xxxxxx, yyyyyy]

        if (elementRef.current) {
            const bb = (elementRef.current as HTMLElement).getBoundingClientRect()
            p = fixCoordinates(p)

            lastInCanvasPointRef.current = p
            isClickedRef.current = true

            onCanvasMouseEvent({
                type: "mouse",
                pressed: isClickedRef.current,
                point: p,
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