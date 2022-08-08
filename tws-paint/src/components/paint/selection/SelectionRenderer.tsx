import { FC } from "react"

import { PaintScene } from "@app/domain/paint/defines"

export type SelectionRendererProps = {
	scene: PaintScene
	presentationWidth: number
	presentationHeight: number
	style?: React.CSSProperties
	className?: string
}

export type SelectionRenderer = FC<SelectionRendererProps>
