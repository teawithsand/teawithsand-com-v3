import React from "react"

import { PrimPaintScene } from "@app/components/redux-dom-paint/defines/PrimPaintScene"

import { Rect } from "tws-common/geometry"

export type SceneRenderProps = {
	scene: PrimPaintScene
	width: number
	height: number
	viewBox: Rect
}

type SceneRender = React.FC<SceneRenderProps>
export default SceneRender
