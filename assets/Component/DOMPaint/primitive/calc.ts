import { Point, Rect } from "./primitive"

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

export const NORM_RECT_MIN = 0
export const NORM_RECT_MAX = 1

/**
 * Normalizes rectangle provided.
 */
export const normalizeRect = (rect: Rect): Rect => {
    const [[x1, y1], [x2, y2]] = rect

    return [
        [
            Math.min(x1, x2),
            Math.min(y1, y2),
        ],
        [
            Math.max(x1, x2),
            Math.max(y1, y2),
        ]
    ]
}

export const rectDimensions = (rect: Rect): {
    width: number,
    height: number,
} => {
    const width = Math.abs(rect[0][0] - rect[1][0])
    const height = Math.abs(rect[0][1] - rect[1][1])

    return {
        width,
        height,
    }
}

export const rectContains = (rect: Rect, p: Point, bordersAllowed: boolean = true) => {
    rect = normalizeRect(rect)
    if (bordersAllowed && rect[NORM_RECT_MAX][0] >= p[0] && rect[NORM_RECT_MAX][1] >= p[1] && rect[NORM_RECT_MIN][0] <= p[0] && rect[NORM_RECT_MIN][1] <= p[1]) {
        return true
    } else if (rect[NORM_RECT_MAX][0] > p[0] && rect[NORM_RECT_MAX][1] > p[1] && rect[NORM_RECT_MIN][0] < p[0] && rect[NORM_RECT_MIN][1] < p[1]) {
        return true
    } else {
        return false
    }
}