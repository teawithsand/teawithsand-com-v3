import React from "react"

export default interface PaintDisplayInfo {
    canvasWidth: number,
    canvasHeight: number
}

export const PaintDisplayInfoContext = React.createContext<PaintDisplayInfo>({
    canvasHeight: 0,
    canvasWidth: 0,
})