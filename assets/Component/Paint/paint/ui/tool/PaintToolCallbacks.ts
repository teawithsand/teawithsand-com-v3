import PaintTool from "./PaintTool"

/**
 * Defines all methods, which ActivePaintTool may use to communicate feedback.
 */
export default interface PaintToolCallbacks {
    /**
     * Notifies parent that mutations have changed and refreshing scene is required.
     */
    notifyMutationsChanged(): void

    /**
     * Notifies parent that tools want it's current mutations to be applied to scene.
     */
    applyMutations(): void

    /**
     * Discards current tool, letting parent decide what should happen now.
     */
    discardTool(): void
    setTool(tool: PaintTool): void
}