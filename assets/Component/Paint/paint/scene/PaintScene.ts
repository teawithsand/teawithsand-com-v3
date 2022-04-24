import PaintLayer, { PaintLayerMetadata } from "../PaintLayer"
import PaintElement from "../PaintElement"

/**
 * Component responsible for taking all PaintElement and grouping them into layers
 * and answering some queries about that data.
 * 
 * Also: may track changes in order to improve paint time.
 * But for simple components, which we are drawing it's overkill to prevent redrawing whole scene.
 * Worst case scenario: we move to webgl, which gives us performance far beyond comprehension of programmer writing 2d graphics stuff.
 * 
 * // TODO(teawithsand): move this thought somewhere else
 */
export default interface PaintScene {
    readonly layers: readonly Readonly<PaintLayer>[]

    // TODO(teawithsand): in order to flex with algo skills, implement quad(since 2d points are used) tree implementation with rectangles
    //  which answers for AABB intersection/containing with specified-in-query rectangle.
    // 
    // Quick note here: do not use KD trees, since rebalancing them is a pain, and it's not really required with interval/quad/oct trees   
    // TODO(teawithsand): research memory optimization techniques, like packing elements into single array or doing Fenwick trees

    /**
     * Sets layers stored in scene.
     */
    setLayers(layers: PaintLayer[]): void

    /**
    * Overrides ith layer.
    * If ith layer does not exist, it gets created.
    * If they were not-existent layers between ith and last previously existent layer, then that hole is filled with empty layers.
    */
    setLayer(i: number, l: PaintLayer): void

    /**
    * Overrides ith layer's metadata.
    */
    setLayerMetadata(i: number, l: PaintLayerMetadata): void

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
     * Appends specified paint elements into nth layer.
     */
    appendToLayer(i: number, ...elements: PaintElement[]): void
}