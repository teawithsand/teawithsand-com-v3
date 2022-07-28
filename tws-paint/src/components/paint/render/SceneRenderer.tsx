import { FC } from "react"

import { PaintScene } from "@app/domain/paint/defines"

export type SceneRendererProps = {
	scene: PaintScene
	presentationWidth: number
	presentationHeight: number
}

export type SceneRenderer = FC<SceneRendererProps>
