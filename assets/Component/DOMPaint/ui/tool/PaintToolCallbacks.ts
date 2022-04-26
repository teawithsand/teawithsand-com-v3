import React from "react"
import PaintTool from "./PaintTool"

type PaintToolCallbacks = {
    updateTool(tool: PaintTool): void
    disableSelf(): void
}

export default PaintToolCallbacks