import React from "react"

import { usePaintSelector } from "@app/domain/paint/redux/selector"

export const SidePanelZoomSection = () => {
	const zoom = usePaintSelector(s => s.uiState.viewOptions.zoomFactor)
	return <div>Zoom: {Math.round(zoom * 100) / 100}</div>
}
