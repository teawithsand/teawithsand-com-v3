import React, { ReactNode, useMemo } from "react"

import { GeneralToolSettingsPanel } from "@app/components/paint/panels/impls/GeneralToolSettingsPanel"
import { PickToolPanel } from "@app/components/paint/panels/impls/PickToolPanel"
import { SceneSizePanel } from "@app/components/paint/panels/impls/SceneSizePanel"
import { ZoomPanel } from "@app/components/paint/panels/impls/ZoomPanel"
import { TitledPanel } from "@app/components/paint/panels/panel-display/TitledPanel"

export enum PaintPanelType {
	SCENE_SIZE = 1,
	PICK_TOOL = 2,
	ZOOM = 3,
	GENERAL_TOOL_SETTINGS = 4,
}

export const usePanelShortTitle = (type: PaintPanelType) => {
	if (type === PaintPanelType.SCENE_SIZE) {
		return "Scene size"
	} else if (type === PaintPanelType.PICK_TOOL) {
		return "Pick tool"
	} else if (type === PaintPanelType.ZOOM) {
		return "Zoom"
	} else if (type === PaintPanelType.GENERAL_TOOL_SETTINGS) {
		return "General tool settings"
	} else {
		throw new Error(`Bad panel type ${type as any}`)
	}
}

export const usePanelTitle = (type: PaintPanelType) => {
	if (type === PaintPanelType.SCENE_SIZE) {
		return "Scene size properties"
	} else if (type === PaintPanelType.PICK_TOOL) {
		return "Pick tool"
	} else if (type === PaintPanelType.ZOOM) {
		return "Zoom properties"
	} else if (type === PaintPanelType.GENERAL_TOOL_SETTINGS) {
		return "General tool settings"
	} else {
		throw new Error(`Bad panel type ${type as any}`)
	}
}

export const usePanel = (
	type: PaintPanelType,
	options?: {
		titled?: boolean
	},
): ReactNode => {
	const title = usePanelTitle(type)

	const panelObtainer = () => {
		if (type === PaintPanelType.SCENE_SIZE) {
			return <SceneSizePanel />
		} else if (type === PaintPanelType.PICK_TOOL) {
			return <PickToolPanel />
		} else if (type === PaintPanelType.ZOOM) {
			return <ZoomPanel />
		} else if (type === PaintPanelType.GENERAL_TOOL_SETTINGS) {
			return <GeneralToolSettingsPanel />
		} else {
			throw new Error(`Bad panel type ${type as any}`)
		}
	}

	const { titled = false } = options ?? {}

	return useMemo(() => {
		const panel = panelObtainer()
		if (titled) {
			return <TitledPanel title={title}>{panel}</TitledPanel>
		}

		return panel
	}, [type, title, titled])
}
