import { PrimPaintScene } from "@app/components/redux-dom-paint/defines/PrimPaintScene"
import React from "react"

export type SceneRenderProps = {
	scene: PrimPaintScene
	width: number
	height: number
}

type SceneRender = React.FC<SceneRenderProps>
export default SceneRender
