import { Point } from "../../primitive";
import { euclideanDistance, rectContains } from "../../primitive/calc";
import ImagePaintElement from "../impls/ImagePaintElement";
import PathPaintElement from "../impls/PathPaintElement";
import PathsPaintElement from "../impls/PathsPaintElement";
import PolygonPaintElement from "../impls/PolygonPaintElement";
import SimpleCanvasPaintElement from "../impls/SimpleCanvasPaintElement";
import PaintElement from "../PaintElement";
import { DefaultPaintElementAABB } from "./PaintElementAABB";

export default interface PaintElementCollisionChecker {
    /**
     * Returns true if element collides with given point, according to rules of specified collision checker.
     */
    checkPointCollision(p: Point, element: PaintElement): boolean
}


function pointsCheck(points: Iterable<Point>, target: Point, strokeSize: number): boolean {
    let hasAny = false
    for (const p of points) {
        hasAny = true
        if (euclideanDistance(p, target) < strokeSize) {
            return true
        }
    }

    if (!hasAny) {
        return false
    }

    return false
}

export class DefaultPaintElementCollisionChecker implements PaintElementCollisionChecker {
    constructor() { }

    private aabb = new DefaultPaintElementAABB()

    checkPointCollision = (p: Point, element: PaintElement): boolean => {
        if (element instanceof PathPaintElement) {
            return pointsCheck(element.points, p, element.stroke.size)
        } else if (element instanceof PathsPaintElement) {
            return pointsCheck(element.paths.flatMap(v => v), p, element.stroke.size)
        } else if (element instanceof ImagePaintElement) {
            const aabb = this.aabb.getAABB(element)
            return rectContains(aabb, p)
        } else if (element instanceof PolygonPaintElement) {
            const aabb = this.aabb.getAABB(element)
            return rectContains(aabb, p)
        } else if (element instanceof SimpleCanvasPaintElement) {
            return false
        } else {
            throw new Error("unsupported element")
        }
    }
}