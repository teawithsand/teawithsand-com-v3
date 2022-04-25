/**
 * Point encoded with x and y coordinates.
 * Point [0, 0] is in top left corner.
 */
export type Point = [number, number]

/**
 * Rectangle defined by two points.
 */
export type Rect = [Point, Point]

/**
 * CSS size in PX units or canvas size in pixels.
 */
export type Size = number

export const pointEquals = (a: Point, b: Point): boolean => {
    return a[0] === b[0] && a[1] === b[1]
}