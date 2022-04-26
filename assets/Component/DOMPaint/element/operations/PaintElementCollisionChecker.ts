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


const pointSegmentDistance = (p: Point, segment: [Point, Point]) => {
    const [x, y] = p
    const [[x1, y1], [x2, y2]] = segment

    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;

    let xx, yy;
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx ** 2 + dy ** 2);
}


// TODO(teawithsand): optimize this. oct trees do really great with this task as well as contains AABB checks.
function pathCheck(points: Iterable<Point>, target: Point, strokeSize: number): boolean {
    let hasAny = false
    let prevPoint: Point | null = null
    for (const p of points) {
        if (prevPoint === null) {
            prevPoint = p
            continue;
        }

        if (pointSegmentDistance(target, [
            prevPoint,
            p,
        ]) <= strokeSize) {
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
            return pathCheck(element.points, p, element.stroke.size)
        } else if (element instanceof PathsPaintElement) {
            for (const path of element.paths) {
                if (pathCheck(path, p, element.stroke.size)) {
                    return true
                }
            }
            return false
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