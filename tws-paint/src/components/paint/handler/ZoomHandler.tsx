import React, { useEffect } from "react"
import { useDispatch } from "react-redux"

import { PaintActionType } from "@app/domain/paint/defines/action"
import { commitPaintActionAndResetUncommitted } from "@app/domain/paint/redux"
import { useCurrentPaintSnapshotSelector } from "@app/domain/paint/redux/selector"

// TODO(teawithsand): move this to action setting zoom
const roundZoom = (a: number) => Math.round(a * 1000) / 1000

export const ZoomHandler = () => {
	const zoomFactor = useCurrentPaintSnapshotSelector(
		s => s.uiState.viewOptions.zoomFactor,
	)

	const dispatch = useDispatch()

	useEffect(() => {
		const wheelHandler = (e: WheelEvent) => {
			if (e.ctrlKey) {
				e.preventDefault()

				if (e.deltaY > 0) {
					dispatch(
						commitPaintActionAndResetUncommitted({
							type: PaintActionType.SET_ZOOM,
							zoomFactor: roundZoom(zoomFactor - 0.05),
						}),
					)
				} else if (e.deltaY < 0) {
					dispatch(
						commitPaintActionAndResetUncommitted({
							type: PaintActionType.SET_ZOOM,
							zoomFactor: roundZoom(zoomFactor + 0.05),
						}),
					)
				}
			}
		}

		document.body.addEventListener("wheel", wheelHandler, {
			passive: false,
		})

		return () => {
			document.body.removeEventListener("wheel", wheelHandler)
		}
	}, [dispatch, zoomFactor])

	return <></>
}
