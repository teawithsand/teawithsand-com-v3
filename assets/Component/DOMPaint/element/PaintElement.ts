import { Point, Rect } from "../primitive"
import PaintElementData from "./PaintElementData"
import RenderHashable from "./RenderHashable"

/**
 * Element, which can be painted.
 * 
 * PaintElements can also contain computed information, like AABB or some other info, which 
 * are updated along with paint element data updates.
 */
export default interface PaintElement<T extends PaintElementData = PaintElementData> extends RenderHashable<T> {

}

export interface AABBPaintElement<T extends PaintElementData = PaintElementData> extends PaintElement<T> {
    /**
     * Returns Axis-Aligned-Bounding-Box of an element.
     */
    readonly aabb: Readonly<Rect>
}

export interface PointCollisionPaintElement<T extends PaintElementData = PaintElementData> extends PaintElement<T> {
    /**
     * Returns true, if this element collides with point provided here.
     */
    checkCollision(p: Readonly<Point>): boolean
}