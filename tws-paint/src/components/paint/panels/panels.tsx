import React, { ReactNode, useMemo } from "react"

import { CanvasDimensionsPanel } from "@app/components/paint/panels/CanvasDimensionsPanel"
import { PickToolPanel } from "@app/components/paint/panels/PickToolPanel"
import { ZoomPanel } from "@app/components/paint/panels/ZoomPanel"

export enum PaintPanelType {
	CANVAS_DIMENSIONS = 1,
	PICK_TOOL = 2,
	ZOOM = 3,
}

export const usePanelShortTitle = (type: PaintPanelType) => {
	if (type === PaintPanelType.CANVAS_DIMENSIONS) {
		return "Scene size"
	} else if (type === PaintPanelType.PICK_TOOL) {
		return "Pick tool"
	} else if (type === PaintPanelType.ZOOM) {
		return "Zoom"
	} else {
		throw new Error(`Bad panel type ${type as any}`)
	}
}

export const usePanelTitle = (type: PaintPanelType) => {
	if (type === PaintPanelType.CANVAS_DIMENSIONS) {
		return "Scene size properties"
	} else if (type === PaintPanelType.PICK_TOOL) {
		return "Pick tool"
	} else if (type === PaintPanelType.ZOOM) {
		return "Zoom properties"
	} else {
		throw new Error(`Bad panel type ${type as any}`)
	}
}

export const usePanel = (type: PaintPanelType): ReactNode => {
	return useMemo(() => {
		if (type === PaintPanelType.CANVAS_DIMENSIONS) {
			return <CanvasDimensionsPanel />
		} else if (type === PaintPanelType.PICK_TOOL) {
			return <PickToolPanel />
		} else if (type === PaintPanelType.ZOOM) {
			return <ZoomPanel />
		} else {
			throw new Error(`Bad panel type ${type as any}`)
		}
	}, [type])
}
