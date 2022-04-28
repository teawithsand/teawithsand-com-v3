import DrawEvent from "@app/Component/DOMPaint/ui/DrawEvent"

export type ToolActivationResult = {
    activeTool: ActiveTool
}
export default interface ActiveTool {
    /**
     * Releases all tool's resources.
     */
    close(): void

    processEvent(e: DrawEvent): void
}
