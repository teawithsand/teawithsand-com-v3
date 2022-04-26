import { Point, Rect } from "../../primitive";
import { normalizeRect } from "../../primitive/calc";
import ImagePaintElement from "../impls/ImagePaintElement";
import PathPaintElement from "../impls/PathPaintElement";
import PathsPaintElement from "../impls/PathsPaintElement";
import PolygonPaintElement from "../impls/PolygonPaintElement";
import SimpleCanvasPaintElement from "../impls/SimpleCanvasPaintElement";
import PaintElement from "../PaintElement";

export default interface PaintElementAABB {
    /**
     * Returns AABB of given element.
     */
    getAABB(element: PaintElement): Rect
}

function pointsAABB(points: Iterable<Point>): Rect {
    const maxes: Point = [-Infinity, -Infinity]
    const mins: Point = [Infinity, Infinity]

    let hasAny = false
    for (const p of points) {
        hasAny = true
        const [x, y] = p
        maxes[0] = Math.max(maxes[0], x)
        maxes[1] = Math.max(maxes[1], y)

        mins[0] = Math.min(mins[0], x)
        mins[1] = Math.min(mins[1], y)
    }

    if (!hasAny) {
        return [[0, 0], [0, 0]]
    }

    return normalizeRect([maxes, mins])
}

export class DefaultPaintElementAABB implements PaintElementAABB {
    constructor() { }

    getAABB = (element: PaintElement): Rect => {
        if (element instanceof PathPaintElement) {
            return pointsAABB(element.points)
        } else if (element instanceof PathsPaintElement) {
            return pointsAABB(element.paths.flatMap((v) => v))
        } else if (element instanceof ImagePaintElement) {
            return normalizeRect(element.rect)
        } else if (element instanceof PolygonPaintElement) {
            return pointsAABB(element.points)
        } else if (element instanceof SimpleCanvasPaintElement) {
            return [[0, 0], [0, 0]]
        } else {
            throw new Error("unsupported element")
        }
    }
}