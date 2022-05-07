import { Rect } from "@app/components/redux-dom-paint/primitive"
import {
	NORM_RECT_MAX,
	NORM_RECT_MIN,
	rectNormalize,
} from "@app/components/redux-dom-paint/primitive/calc"
import {
	rectArea,
	rectIntersection,
	rectRelativeOffsets,
	rectTranslate,
} from "@app/util/geometry/rect/simple"

// TODO(teawithsand): replace this with some RNG, which is seed-based
const randomRect = () => {
	return rectNormalize([
		[Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
		[Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
	])
}

describe("rectangle op", () => {
	describe("rectRelativeOffsets", () => {
		it("computes correct relative offsets", () => {
			for (let i = 0; i < 100; i++) {
				const sourceRect = randomRect()
				const destRect = randomRect()
				const offsets = rectRelativeOffsets(sourceRect, destRect)

				const newRect = rectNormalize([
					[
						sourceRect[NORM_RECT_MIN][0] + offsets.left,
						sourceRect[NORM_RECT_MIN][1] + offsets.bottom,
					],
					[
						sourceRect[NORM_RECT_MAX][0] + offsets.right,
						sourceRect[NORM_RECT_MAX][1] + offsets.top,
					],
				])

				expect(destRect).toEqual(newRect)
			}
		})
	})
	describe("rectIntersection", () => {
		it("computes ok rect intersection", () => {
			const tests: [Rect, Rect, Rect | null][] = [
				[
					[
						[0, 0],
						[0, 0],
					],
					[
						[1, 1],
						[1, 1],
					],
					null,
				],
				[
					[
						[0, 0],
						[0, 0],
					],
					[
						[0, 0],
						[0, 0],
					],
					[
						[0, 0],
						[0, 0],
					],
				],
				[
					[
						[0, 0],
						[0, 0],
					],
					[
						[0, 0],
						[1, 1],
					],
					[
						[0, 0],
						[0, 0],
					],
				],
				[
					[
						[0, 0],
						[1, 1],
					],
					[
						[1, 1],
						[2, 2],
					],
					[
						[1, 1],
						[1, 1],
					],
				],
				[
					[
						[0, 0],
						[2, 2],
					],
					[
						[0, 0],
						[1, 1],
					],
					[
						[0, 0],
						[1, 1],
					],
				],
				[
					[
						[0, 2],
						[2, 3],
					],
					[
						[1, 1],
						[3, 1],
					],
					null,
				],
				[
					rectTranslate(
						[
							[0, 0],
							[3, 3],
						],
						[2, 2]
					),
					[
						[0, 0],
						[3, 3],
					],
					[
						[2, 2],
						[3, 3],
					],
				],
			]

			for (const [a, b, res] of tests) {
				const actualRes = rectIntersection(a, b)
				expect(res).toEqual(actualRes)
			}
		})

		it("returns argument, when intersecting with itself", () => {
			const r = randomRect()
			for (let i = 0; i < 100; i++) {
				const res = rectIntersection(r, r)
				expect(res).toEqual(r)
			}
		})

		it("passes random area based tests", () => {
			// Intersection of two rectangles always has area less than any of given

			for (let i = 0; i < 1000; i++) {
				const r1 = randomRect()
				const r2 = randomRect()

				const res = rectIntersection(r1, r2)
				const resArea = res ? rectArea(res) : 0

				// note: this is hacky way of doing deep comparison
				if (JSON.stringify(r1) === JSON.stringify(r2)) {
					expect(resArea).toEqual(rectArea(r1))
				} else {
					expect(resArea).toBeLessThanOrEqual(
						Math.min(rectArea(r1), rectArea(r2))
					)
				}
			}
		})
	})
})
