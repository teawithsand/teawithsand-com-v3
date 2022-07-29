import {
	PathLineCapType,
	PathLineJoinType,
} from "@app/domain/paint/defines/element/path"

import { Color } from "tws-common/color"

export enum PaintToolType {
	MOVE = "move",
	PATH = "path",
}

export type PaintGlobalToolConfig = {
	activeTool: PaintToolType
	activeLayerIndex: number
	strokeColor: Color
	fillColor: Color | null
}

/**
 * Contains configuration, which are tool-specific.
 */
export type PaintToolsConfig = {
	[PaintToolType.PATH]: PathToolConfig
}

export type PathToolConfig = {
	stroke: PathLineCapType
	join: PathLineJoinType
}
