import React from "react"
import PaintScene from "../../scene/PaintScene"
import PaintTool from "./PaintTool"

type PaintToolCallbacks = {
    updateTopLevelStyles(styles: React.CSSProperties): void
    updateScene(scene: PaintScene): void
    updateTool(tool: PaintTool): void
    disableSelf(): void
}

export default PaintToolCallbacks