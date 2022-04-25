/**
 * Color encoded as RGB or RGBA array.
 */
export type Color = [number, number, number, number] | [number, number, number]

/**
 * Encodes color for HTML canvas.
 */
export const encodeColor = (c: Color): string => {
    if (typeof c === "string") {
        return c
    } else {
        if (c.length === 3) {
            c = [...c, 1]
        }
        return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`
    }
}
