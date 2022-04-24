import { Point } from "../primitive"

/**
 * Translates given point by given origin.
 */
export const makePointTranslator = (by: Point) => {
    return (p: Point): Point => {
        return [
            p[0] + by[0],
            p[1] + by[1],
        ]
    }
}