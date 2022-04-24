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
     * Discards current tool, letting parent decide what should happen now.
     */
    discardTool(): void
    setTool(tool: PaintTool): void
}