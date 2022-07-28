import { FC } from "react"

import { PaintScene } from "@app/domain/paint/defines"

import { Rect } from "tws-common/geometry"

export type SceneRendererProps = {
	scene: PaintScene
	width: number
	height: number
	viewBox: Rect
}

export type SceneRenderer = FC<SceneRendererProps>
