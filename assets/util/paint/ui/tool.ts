import { DrawableElement } from "../primitive"
import { PaintGlobalSettings } from "./settings"

export interface ActiveToolCallbacks {
    /**
     * Notifies manager, that element was modified and
     * it should be rerendered, preferably fast.
     */
    onElementModified: () => void,
}

export interface ActivePaintTool {
    getCurrentElement(): DrawableElement | null
    close(): void
}

/**
 * Single paint tool, like brush or something.
 * It's capable of creating new elements.
 */
export interface PaintTool {
    /**
     * Creates active tool, which handles rendering and stuff.
     */
    activate(callbacks: ActiveToolCallbacks): ActivePaintTool

    /**
     * Handles changing paint tool state using some input.
     */
    handleInput(input: PaintToolInput): void
}

export type PaintToolInput = {
    type: "cursor",
    data: {
        x: number
        y: number
        pressed: boolean
    }
} | {
    type: "global-settings",
    data: PaintGlobalSettings,
}
