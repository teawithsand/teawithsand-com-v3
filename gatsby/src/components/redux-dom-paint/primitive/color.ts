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
			return `rgba(${c[0]}, ${c[1]}, ${c[2]}, 1)`
		}
		return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`
	}
}

export const parseColor = (input: string): Color => {
	if (input.substring(0, 1) == "#") {
		const columnLength = (input.length - 1) / 3
		const fact = [17, 1, 0.062272][columnLength - 1]
		return [
			Math.round(
				parseInt(input.substring(1, 1 + columnLength), 16) * fact
			),
			Math.round(
				parseInt(
					input.substring(
						1 + columnLength,
						1 + columnLength + columnLength
					),
					16
				) * fact
			),
			Math.round(
				parseInt(
					input.substring(
						1 + 2 * columnLength,
						1 + 2 * columnLength + columnLength
					),
					16
				) * fact
			),
		]
	} else {
		const v = input
			.split("(")[1]
			.split(")")[0]
			.split(",")
			.map(x => +x)
		if (v.length !== 3 && v.length !== 4) {
			throw new Error("invalid array length")
		}

		return v as Color
	}
}
