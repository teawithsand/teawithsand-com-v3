import { FC } from "react"

import { PaintScene } from "@app/domain/paint/defines"

export type SceneRendererProps = {
	scene: PaintScene
	width: number
	height: number
}

export type SceneRenderer = FC<SceneRendererProps>
