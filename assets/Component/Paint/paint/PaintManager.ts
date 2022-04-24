import Canvas from "../canvas/Canvas";
import { Layer, LayerMetadata } from "./Layer";
import PaintElement from "./PaintElement";

/**
 * Paint manager handles:
 * 1. Getting PaintElements
 * 2. Managing layers and stuff
 * 3. Translating elements from paint elements into canvas ones.
 * 4. Plotting these elements onto canvas, preferably efficiently.
 */
export default interface PaintManager {
    /**
     * Underlying canvas used.
     */
    readonly canvas: Canvas

    /**
     * Returns all layers.
     */
    getLayers(): readonly Readonly<Layer>[]

    /**
    * Overrides ith layer.
    * If ith layer does not exist, it gets created.
    * If they were not-existent layers between ith and last previously existent layer, then that hole is filled with empty layers.
    */
    setLayer(i: number, l: Layer): void

    /**
    * Overrides ith layer's metadata.
    */
    setLayerMetadata(i: number, l: LayerMetadata): void

    /**
     * Removes ith layer.
     * If last layer is removed it's replaced with empty layer.
     * If current layer is removed it's index is replaced with topmost layer index.
     * If removing this layer changes current layer index, then it's updated so that CLI still points to same layer.
     * 
     * Behavior is undefined when ith layer does not exist.
     */
    removeLayer(i: number): void

    /**
     * Sets layer, which current element is "applied" to.
     */
    setCurrentLayerIndex(i: number): void
    getCurrentLayerIndex(): number

    /**
     * Appends specified PaintElement to current layer.
     */
    appendToCurrentLayer(...elements: PaintElement[]): void

    /**
     * Sets or unsets current element.
     */
    setCurrentElements(element: PaintElement[]): void

    /**
     * Releases all *internal* resources allocated by this PaintManager.
     * Canvas is returned for user and may be used for further processing.
     */
    close(): void
}