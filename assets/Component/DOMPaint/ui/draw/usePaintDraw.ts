import { Point } from "@app/Component/DOMPaint/primitive"
import DrawEvent from "@app/Component/DOMPaint/ui/DrawEvent"
import { RefObject, useCallback, useEffect, useRef } from "react"

// TODO(teawithsand): rewrite it
// TODO(teawithsand): make this emit events about scrolling, since it's crutial for making it work with new tool scheme

export default (
    elementRef: RefObject<HTMLElement>,
    onCanvasMouseEvent: (data: DrawEvent & { type: "mouse" | "scroll" }) => void
) => {
    const isClickedRef = useRef(false)
    const lastInCanvasPointRef = useRef<{
        corrected: Point,
        absolute: Point
    }>({
        absolute: [0, 0],
        corrected: [0, 0],
    })

    const fixCoordinates = (p: Point): Point => {
        if (elementRef.current) {
            const bb = (elementRef.current as HTMLElement).getBoundingClientRect()

            return [
                p[0] - bb.left + elementRef.current.scrollLeft,
                p[1] - bb.top + elementRef.current.scrollTop,
            ]
        } else {
            return [
                p[0],
                p[1]
            ]
        }
    }

    const handlePointerPositionChange = useCallback((e: any) => {
        const data = {
            x: e.clientX,
            y: e.clientY,
        }
        let { x: xxxxxx, y: yyyyyy } = data
        const abs: Point = [xxxxxx, yyyyyy]
        let p: Point = [xxxxxx, yyyyyy]

        if (onCanvasMouseEvent && elementRef.current) {
            const bb = (elementRef.current as HTMLElement).getBoundingClientRect()
            // ensure our point is in bound of canvas
            if (xxxxxx < 0 || yyyyyy < 0 || xxxxxx > bb.width || yyyyyy > bb.height) {
                return;
            }

            p = fixCoordinates(p)

            lastInCanvasPointRef.current = {
                absolute: abs,
                corrected: p,
            }

            if (isClickedRef.current) {
                onCanvasMouseEvent({
                    type: "mouse",
                    pressed: isClickedRef.current,
                    canvasPoint: p,
                    screenPoint: [xxxxxx, yyyyyy],
                })
            }
        }
    }, [onCanvasMouseEvent])

    const handleOnPointerUp = useCallback(() => {
        if (!isClickedRef.current) {
            return;
        }

        isClickedRef.current = false

        const {
            absolute, corrected
        } = lastInCanvasPointRef.current

        onCanvasMouseEvent({
            type: "mouse",
            pressed: isClickedRef.current,
            canvasPoint: corrected,
            screenPoint: absolute,
        })
    }, [onCanvasMouseEvent])

    const handleOnPointerDown = useCallback((e: any) => {
        const data = {
            x: e.clientX,
            y: e.clientY,
        }
        let { x: xxxxxx, y: yyyyyy } = data
        const abs: Point = [xxxxxx, yyyyyy]
        let p: Point = [xxxxxx, yyyyyy]

        if (elementRef.current) {
            const bb = (elementRef.current as HTMLElement).getBoundingClientRect()
            p = fixCoordinates(p)

            lastInCanvasPointRef.current = {
                absolute: abs,
                corrected: p,
            }
            isClickedRef.current = true

            onCanvasMouseEvent({
                type: "mouse",
                pressed: isClickedRef.current,
                canvasPoint: p,
                screenPoint: abs,
            })
        }
    }, [onCanvasMouseEvent])

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
        onPointerDown: handleOnPointerDown,
        onPointerUp: handleOnPointerUp,
        onPointerMove: handlePointerPositionChange,
    }
}