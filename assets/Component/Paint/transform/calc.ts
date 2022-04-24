import { Point } from "../primitive/primitive"

export const euclideanDistance = (...points: Point[]) => {
    if (points.length <= 1)
        return 0

    let prev = points[0]
    let agg = 0
    for (const p of points.slice(1)) {
        const d = Math.sqrt((prev[0] - p[0]) ** 2 + (prev[1] - p[1]) ** 2)
        agg += d
        prev = p
    }

    return agg
}

export const manhattanDistance = (...points: Point[]) => {
    if (points.length <= 1)
        return 0

    let prev = points[0]
    let agg = 0
    for (const p of points.slice(1)) {
        const d = Math.abs(prev[0] - p[0]) + Math.abs(prev[1] - p[1])
        agg += d
        prev = p
    }

    return agg
}

/**
 * Normalizes rectangle provided.
 */
export const normalizeRect = (points: [Point, Point]): [Point, Point] => {
    const [[x1, y1], [x2, y2]] = points

    return [
        [
            Math.min(x1, x2),
            Math.max(y1, y2),
        ],
        [
            Math.max(x1, x2),
            Math.min(y1, y2),
        ]
    ]
}