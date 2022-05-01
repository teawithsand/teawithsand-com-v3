/**
 * Entity, which can be mutated via special methods but otherwise is immutable.
 * It notifies that it was changed by updating renderHash.
 */
export default interface RenderHashable<T> {
    /**
     * Render hash is not hash, but rather identifier, which 
     * changes when paint element gets changed. It's best effort based, so it's allowed
     * to change when element hasn't changed.
     */
    readonly renderHash: string

    /**
     * Data of paint element.
     * It is *not* immutable and *may* change between calls to update* functions.
     * RenderHash will change if it happens.
     */
    readonly data: Readonly<T>

    /**
     * Performs arbitrary update on PaintElement's data.
     * Some implementations may provide specific methods for fast updates of internal data structures.
     * 
     * Note: element may retain data in same or modified form or modify it, if it won't affect rendering.
     * Note #2: updater may update data in place, or return new one.
     */
     updateData(updater: (data: T) => T): void
}