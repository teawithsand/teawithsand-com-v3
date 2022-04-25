import PaintElement from "../paint/PaintElement";
import { Point } from "../primitive";

/**
 * Computes Axis Aligned Bounding Box of specified paint element.
 * Returns normalized rectangle.
 * 
 * For computing text's AABB canvas context is required.
 * It returns 0 area rectangle with text's root point if context's not provided.
 */
export const paintElementAABB = (element: PaintElement, ctx?: CanvasRenderingContext2D): [
    Point,
    Point
] => {
    const p = new Path2D
    throw new Error("Not implemented yet")
    /*

    if (element.type === "rect") {
        return normalizeRect(element.ends)
    } else if (element.type === "circle") {
        const { radius, center: [x, y] } = element

        return normalizeRect([
            [
                x + radius,
                y + radius,
            ],
            [
                x - radius,
                y - radius,
            ]
        ])
    } else if (element.type === "path") {
        const maxes: Point = [-Infinity, -Infinity]
        const mins: Point = [Infinity, Infinity]
        if (element.points.length === 0) {
            return [[0, 0], [0, 0]]
        }

        for (const p of element.points) {
            const [x, y] = p
            maxes[0] = Math.max(maxes[0], x)
            maxes[1] = Math.max(maxes[1], y)

            mins[0] = Math.min(mins[0], x)
            mins[1] = Math.min(mins[1], y)
        }

        return normalizeRect([maxes, mins])
    } else if (element.type === "polygon") {
        const maxes: Point = [-Infinity, -Infinity]
        const mins: Point = [Infinity, Infinity]
        if (element.points.length === 0) {
            return [[0, 0], [0, 0]]
        }

        for (const p of element.points) {
            const [x, y] = p
            maxes[0] = Math.max(maxes[0], x)
            maxes[1] = Math.max(maxes[1], y)

            mins[0] = Math.min(mins[0], x)
            mins[1] = Math.min(mins[1], y)
        }

        return normalizeRect([maxes, mins])
    } else if (element.type === "image") {
        return normalizeRect(element.position)
    } else if (element.type === "text") {
        // TODO(teawithsand): AABB for text without using canvas measure text
        //  since it's quite ugly to use context for such simple computational operation
        //  polyfill context with something like OffscreenCanvas or something maybe?

        if (!ctx)
            return [element.position, element.position]

        // TODO(teawithsand): apply element props to canvas

        const metrics = ctx.measureText(element.text)
        const width = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight)
        const height = element.size

        // TODO(teawithsand): fix this, depending on some settings, actual point where text is anchored may change
        return normalizeRect([
            [
                element.position[0],
                element.position[1],
            ],
            [
                element.position[0] + width,
                element.position[1] + height,
            ]
        ])
    } else {
        throw new Error("unreachable code")
    }
    */
}