import PaintManagerMutation from "../../scene/mutation/PaintManagerMutation"
import PaintTool from "./PaintTool"

/**
 * Defines all methods, which ActivePaintTool may use to communicate feedback.
 */
export default interface PaintToolCallbacks {
    /**
     * Notifies parent that mutations have changed and refreshing scene is required.
     */
    notifyMutationsChanged(mutations: PaintManagerMutation[]): void

    /**
     * Notifies parent that current mutations should be applied to canvas.
     * Also unsets mutations from local buffer, since now they are part of canvas.
     */
    notifyMutationsApply(): void

    /**
     * Discards current tool, letting parent decide what should happen now.
     */
    discardTool(): void

    /**
     * Sets new tool, which replaces this one.
     */
    setTool(tool: PaintTool): void
}