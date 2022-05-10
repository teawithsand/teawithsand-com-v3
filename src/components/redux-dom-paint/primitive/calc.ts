import {
	Point,
	Rect,
} from "@app/components/redux-dom-paint/primitive/primitive"

export const euclideanDistance = (...points: Point[]) => {
	if (points.length <= 1) return 0

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
	if (points.length <= 1) return 0

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

export const pointSegmentDistance = (
	p: Readonly<Point>,
	segment: Readonly<[Readonly<Point>, Readonly<Point>]>,
) => {
	const [x, y] = p
	const [[x1, y1], [x2, y2]] = segment

	const A = x - x1
	const B = y - y1
	const C = x2 - x1
	const D = y2 - y1

	const dot = A * C + B * D
	const len_sq = C * C + D * D
	let param = -1
	if (len_sq != 0)
		//in case of 0 length line
		param = dot / len_sq

	let xx, yy
	if (param < 0) {
		xx = x1
		yy = y1
	} else if (param > 1) {
		xx = x2
		yy = y2
	} else {
		xx = x1 + param * C
		yy = y1 + param * D
	}

	const dx = x - xx
	const dy = y - yy
	return Math.sqrt(dx ** 2 + dy ** 2)
}

/**
 * Normalizes rectangle provided.
 */
export const rectNormalize = (rect: Readonly<Rect>): Rect => {
	const [[x1, y1], [x2, y2]] = rect

	return [
		[Math.min(x1, x2), Math.min(y1, y2)],
		[Math.max(x1, x2), Math.max(y1, y2)],
	]
}

export const rectDimensions = (
	rect: Rect,
): {
	width: number
	height: number
} => {
	const width = Math.abs(rect[0][0] - rect[1][0])
	const height = Math.abs(rect[0][1] - rect[1][1])

	return {
		width,
		height,
	}
}

export const rectContains = (
	rect: Readonly<Rect>,
	p: Readonly<Point>,
	bordersAllowed = true,
) => {
	rect = rectNormalize(rect)
	if (
		bordersAllowed &&
		rect[NORM_RECT_MAX][0] >= p[0] &&
		rect[NORM_RECT_MAX][1] >= p[1] &&
		rect[NORM_RECT_MIN][0] <= p[0] &&
		rect[NORM_RECT_MIN][1] <= p[1]
	) {
		return true
	} else if (
		rect[NORM_RECT_MAX][0] > p[0] &&
		rect[NORM_RECT_MAX][1] > p[1] &&
		rect[NORM_RECT_MIN][0] < p[0] &&
		rect[NORM_RECT_MIN][1] < p[1]
	) {
		return true
	} else {
		return false
	}
}

/**
 * Creates zero sized rectangle from point.
 */
export const pointRect = (point: Point): Rect => [[...point], [...point]]

/**
 * Grows rectangle by specified size.
 */
export const rectGrow = (rect: Readonly<Rect>, by: number): Rect => {
	rect = rectNormalize(rect)

	const normalizeNo = (n: number): number => {
		if (n < 0) return 0
		return n
	}

	return [
		[normalizeNo(rect[0][0] - by), normalizeNo(rect[0][1] - by)],
		[normalizeNo(rect[1][0] + by), normalizeNo(rect[1][1] + by)],
	]
}
