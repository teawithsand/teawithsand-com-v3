import { RefObject, useCallback, useEffect, useRef } from "react"

import { Point } from "@app/components/redux-dom-paint/primitive"
import DrawEvent from "@app/components/redux-dom-paint/ui/tool/DrawEvent"

// TODO(teawithsand): do not emit mouse events if mouse is over scrollbar

export default (
	elementRef: RefObject<null | HTMLElement>,
	onCanvasEvent: (data: DrawEvent & { type: "mouse" | "scroll" }) => void,
) => {
	// TODO(teawithsand): to all events sent here apply redux correction, which takes into consideration
	//  factors like zoom and x/y offsets

	const isClickedRef = useRef(false)
	const lastInCanvasPointRef = useRef<{
		corrected: Point
		absolute: Point
	}>({
		absolute: [0, 0],
		corrected: [0, 0],
	})

	const fixCoordinates = (p: Point): Point => {
		if (elementRef.current) {
			const bb = (
				elementRef.current as HTMLElement
			).getBoundingClientRect()

			return [
				p[0] - bb.left + elementRef.current.scrollLeft,
				p[1] - bb.top + elementRef.current.scrollTop,
			]
		} else {
			return [p[0], p[1]]
		}
	}

	const handlePointerPositionChange = useCallback(
		(abs: Readonly<Point>) => {
			const [x, y] = abs
			let p: Point = [...abs]

			if (onCanvasEvent && elementRef.current) {
				const bb = (
					elementRef.current as HTMLElement
				).getBoundingClientRect()
				// ensure our point is in bound of canvas
				if (x < 0 || y < 0 || x > bb.width || y > bb.height) {
					return
				}

				p = fixCoordinates(p)

				lastInCanvasPointRef.current = {
					absolute: [...abs],
					corrected: [...p],
				}

				if (isClickedRef.current) {
					onCanvasEvent({
						type: "mouse",
						pressed: isClickedRef.current,
						canvasPoint: [...p],
						screenPoint: [...abs],
					})
				}
			}
		},
		[onCanvasEvent],
	)

	const handleOnPointerUp = useCallback(() => {
		if (!onCanvasEvent || !isClickedRef.current) {
			return
		}

		isClickedRef.current = false

		const { absolute, corrected } = lastInCanvasPointRef.current

		onCanvasEvent({
			type: "mouse",
			pressed: isClickedRef.current,
			canvasPoint: corrected,
			screenPoint: absolute,
		})
	}, [onCanvasEvent])

	const handleOnPointerDown = useCallback(
		(abs: Readonly<Point>) => {
			let p: Point = [...abs]

			if (onCanvasEvent && elementRef.current) {
				p = fixCoordinates(p)

				lastInCanvasPointRef.current = {
					absolute: [...abs],
					corrected: p,
				}
				isClickedRef.current = true

				onCanvasEvent({
					type: "mouse",
					pressed: isClickedRef.current,
					canvasPoint: [...p],
					screenPoint: [...abs],
				})
			}
		},
		[onCanvasEvent],
	)

	const handleOnScroll = useCallback(() => {
		if (onCanvasEvent && elementRef.current) {
			const { scrollWidth, scrollHeight, scrollLeft, scrollTop } =
				elementRef.current
			onCanvasEvent({
				type: "scroll",
				scrollHeight,
				scrollWidth,
				scrollY: scrollTop,
				scrollX: scrollLeft,
			})
		}
	}, [onCanvasEvent])

	useEffect(() => {
		const cb = (e: any) => {
			const flags = e.buttons !== undefined ? e.buttons : e.which
			const mouseClicked = (flags & 1) === 1

			if (!mouseClicked) handleOnPointerUp()
		}

		document.addEventListener("mouseup", cb)
		// note: this is required, since it prevents bug, which causes drawing when user presses RMB and moves mouse away
		document.addEventListener("mousemove", cb)
		return () => {
			document.removeEventListener("mouseup", cb)
			document.addEventListener("mousemove", cb)
		}
	}, [onCanvasEvent])

	return {
		onPointerDown: (e: any) => handleOnPointerDown([e.clientX, e.clientY]),
		onPointerUp: () => handleOnPointerUp(),
		onPointerMove: (e: any) =>
			handlePointerPositionChange([e.clientX, e.clientY]),
		onScroll: (e: any) => handleOnScroll(),
	}
}
