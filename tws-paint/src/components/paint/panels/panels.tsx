import React, { ReactNode, useMemo } from "react"

import { ExportPanel } from "@app/components/paint/panels/impls/ExportPanel"
import { GeneralToolSettingsPanel } from "@app/components/paint/panels/impls/GeneralToolSettingsPanel"
import { LoadPanel } from "@app/components/paint/panels/impls/LoadPanel"
import { PickToolPanel } from "@app/components/paint/panels/impls/PickToolPanel"
import { SavePanel } from "@app/components/paint/panels/impls/SavePanel"
import { SceneSizePanel } from "@app/components/paint/panels/impls/SceneSizePanel"
import { ZoomPanel } from "@app/components/paint/panels/impls/ZoomPanel"
import { TitledPanel } from "@app/components/paint/panels/panel-display/TitledPanel"

export enum PaintPanelType {
	SCENE_SIZE = 1,
	PICK_TOOL = 2,
	ZOOM = 3,
	GENERAL_TOOL_SETTINGS = 4,
	EXPORT = 5,
	SAVE = 6,
	LOAD = 7,
}

export const usePanelShortTitle = (type: PaintPanelType) => {
	if (type === PaintPanelType.SCENE_SIZE) {
		return "Scene size"
	} else if (type === PaintPanelType.PICK_TOOL) {
		return "Pick tool"
	} else if (type === PaintPanelType.ZOOM) {
		return "Zoom"
	} else if (type === PaintPanelType.GENERAL_TOOL_SETTINGS) {
		return "General settings"
	} else if (type === PaintPanelType.EXPORT) {
		return "Export image"
	} else if (type === PaintPanelType.SAVE) {
		return "Save"
	} else if (type === PaintPanelType.LOAD) {
		return "Load"
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
	} else if (type === PaintPanelType.EXPORT) {
		return "Export image"
	} else if (type === PaintPanelType.SAVE) {
		return "Save"
	} else if (type === PaintPanelType.LOAD) {
		return "Load"
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
		} else if (type === PaintPanelType.EXPORT) {
			return <ExportPanel />
		} else if (type === PaintPanelType.SAVE) {
			return <SavePanel />
		} else if (type === PaintPanelType.LOAD) {
			return <LoadPanel />
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
