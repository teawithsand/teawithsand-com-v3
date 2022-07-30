import React from "react"

import { useCurrentPaintSnapshotSelector } from "@app/domain/paint/redux/selector"

export const SidePanelZoomSection = () => {
	const zoom = useCurrentPaintSnapshotSelector(
		s => s.uiState.viewOptions.zoomFactor,
	)
	return <div>Zoom: {Math.round(zoom * 100) / 100}</div>
}
