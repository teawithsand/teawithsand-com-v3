/**
 * Color encoded as RGBA array.
 */
export type Color = [number, number, number, number]

/**
 * Encodes color for HTML canvas.
 */
export const encodeColor = (c: Color): string => {
    if (typeof c === "string") {
        return c
    } else {
        return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`
    }
}
