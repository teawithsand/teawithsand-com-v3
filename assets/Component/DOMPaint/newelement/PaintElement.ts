import { Point, Rect } from "../primitive"

/**
 * Element, which can be painted.
 * 
 * PaintElements can also contain computed information, like AABB or some other info, which 
 * are updated along with paint element data updates.
 */
export default interface PaintElement<T> {
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

export interface AABBPaintElement<T> extends PaintElement<T> {
    /**
     * Returns Axis-Aligned-Bounding-Box of an element.
     */
    readonly aabb: Readonly<Rect>
}

export interface PointCollisionPaintElement<T> extends PaintElement<T> {
    /**
     * Returns true, if this element collides with point provided here.
     */
    checkCollision(p: Readonly<Point>): boolean
}