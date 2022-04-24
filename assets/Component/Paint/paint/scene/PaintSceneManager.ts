import Canvas from "../../canvas/Canvas"
import PaintScene from "./PaintScene"
import PaintManagerMutation from "./mutation/PaintManagerMutation"

/**
 * Paint manager handles coordinating scene and canvas along with some features needed for UI.
 */
export default interface PaintSceneManager {
    /**
     * Underlying canvas used.
     * Should not be mutated directly. It's UB to do so.
     */
    readonly canvas: Canvas

    /**
     * Scene used.
     * Can be mutated directly.
     */
    readonly scene: PaintScene

    /**
     * Sets mutations to be applied when performing next render.
     */
    setMutations(mutations: PaintManagerMutation[]): void

    /**
     * Applies specified set of mutations to scene directly.
     */
    applyMutations(mutations: PaintManagerMutation[]): void

    /**
     * Commits any changes applied to layerStore and/or append/override values and performs rendering.
     */
    commit(): void

    /**
     * Releases all *internal* resources allocated by this PaintManager.
     * Canvas is returned for user and may be used for further processing.
     */
    close(): void
}