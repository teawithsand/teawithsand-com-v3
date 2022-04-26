import React from "react"
import PaintTool from "./PaintTool"

type PaintToolCallbacks = {
    updateTopLevelStyles(styles: React.CSSProperties): void
    updateTool(tool: PaintTool): void
    disableSelf(): void
}

export default PaintToolCallbacks