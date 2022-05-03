import React from "react"

export default interface PaintDisplayElementInfo {
	canvasWidth: number
	canvasHeight: number
}

export const PaintDisplayElementInfoContext =
	React.createContext<PaintDisplayElementInfo>({
		canvasHeight: 0,
		canvasWidth: 0,
	})
