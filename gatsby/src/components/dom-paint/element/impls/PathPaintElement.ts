import {
	AABBPaintElement,
	PointCollisionPaintElement,
} from "@app/components/dom-paint/element/PaintElement"
import PaintElementData from "@app/components/dom-paint/element/PaintElementData"
import {
	Color,
	encodeColor,
	Point,
	Rect,
} from "@app/components/redux-dom-paint/primitive"
import {
	pointSegmentDistance,
	rectContains,
	rectGrow,
	rectNormalize,
} from "@app/components/redux-dom-paint/primitive/calc"
import { generateUUID } from "@app/util/lang/uuid"
import React from "react"

export type PathPaintElementEntry =
	| {
			type: "M"
			point: Point
	  }
	| {
			type: "L"
			point: Point
	  }
	| {
			type: "Z"
	  }
      
// TODO(teawithsand): more entries there, preferably some more complex values like circles or rectangles here

export type PathPaintElementData = {
	entries: PathPaintElementEntry[]
	stroke: PathStrokeData
	fill: PathFillData | null
} & PaintElementData

export type PathLineCapType = "butt" | "square" | "round"
export type PathLineJoinType = "miter" | "round" | "bevel"

export type PathStrokeData = {
	color: Color
	size: number
	linecap: PathLineCapType
	linejoin: PathLineJoinType
}

export type PathFillData = {
	color: Color
}

/**
 * Paint element, which denotes path, like SVG one.
 */
export default class PathPaintElement
	implements
		AABBPaintElement<PathPaintElementData>,
		PointCollisionPaintElement<PathPaintElementData>
{
	private innerRenderHash = generateUUID()
	private innerAABB: Rect = [
		[0, 0],
		[0, 0],
	]
	private innerStringPath: string = ""

	private isAABBComputed = false
	private isStringPathComputed = false

	constructor(private innerData: PathPaintElementData) {
		// shallow copy, just to be sure
		this.innerData = {
			...innerData,
			entries: [...innerData.entries],
		}
	}

	updateData = (
		updater: (data: PathPaintElementData) => PathPaintElementData
	): void => {
		this.innerData = updater(this.innerData)
		this.innerRenderHash = generateUUID()

		this.innerStringPath = "" // free resources for gc
		this.isAABBComputed = false
		this.isStringPathComputed = false
	}

	updateStrokeData = (stroke: PathStrokeData) => {
		this.innerRenderHash = generateUUID()
		this.innerData = {
			...this.innerData,
			stroke,
		}
	}

	updateFillData = (fill: PathFillData | null) => {
		this.innerRenderHash = generateUUID()
		this.innerData = {
			...this.innerData,
			fill,
		}
	}

	addEntries = (entries: Readonly<Readonly<PathPaintElementEntry>[]>) => {
		this.updateData(d => {
			for (const e of entries) {
				d.entries.push(e)
			}
			return d
		})
	}

	// TODO(teawithsand): implement it with oct-tree
	//  this is way too slow
	checkCollision = (p: Readonly<Point>): boolean => {
		// optimization for paths with small AABB
		// if we are not targeting our AABB, then why even bother do further checking
		// note: rectangle is grown by the stroke size in order to make sure that we catch all possible points.
		if (!rectContains(rectGrow(this.aabb, this.innerData.stroke.size), p)) {
			return false
		}

		let currentLocation: Point = [0, 0]
		let start: Point = [0, 0]
		for (const e of this.innerData.entries) {
			if (e.type === "M") {
				currentLocation = e.point
				start = e.point
			} else if (e.type === "L") {
				// note: it's approximation, actual intersection depends on things like stroke shape
				// but for our use case it's ok
				if (
					pointSegmentDistance(p, [currentLocation, e.point]) >=
					this.innerData.stroke.size
				) {
					return true
				}
				currentLocation = e.point
			} else if (e.type === "Z") {
				if (
					pointSegmentDistance(p, [currentLocation, start]) >=
					this.innerData.stroke.size
				) {
					return true
				}

				currentLocation = start
			}
		}

		return false
	}

	private computeStringPath = () => {
		this.innerStringPath = this.data.entries
			.map(e => {
				if (e.type === "M" || e.type === "L") {
					return `${e.type} ${e.point[0]},${e.point[1]}`
				} else if (e.type === "Z") {
					return "Z"
				}
			})
			.join(" ")
		this.isStringPathComputed = true
	}

	private computeAABB = () => {
		const maxes: Point = [-Infinity, -Infinity]
		const mins: Point = [Infinity, Infinity]

		let hasAny = false
		for (const e of this.data.entries) {
			if (e.type === "M" || e.type === "L") {
				hasAny = true
				const [x, y] = e.point
				maxes[0] = Math.max(maxes[0], x)
				maxes[1] = Math.max(maxes[1], y)

				mins[0] = Math.min(mins[0], x)
				mins[1] = Math.min(mins[1], y)
			}
		}

		if (!hasAny) {
			this.innerAABB = [
				[0, 0],
				[0, 0],
			] // empty path has zero AABB
		} else {
			this.innerAABB = rectNormalize([maxes, mins])
		}
		this.isAABBComputed = true
	}

	get renderHash() {
		return this.innerRenderHash
	}

	get data() {
		return this.innerData
	}

	get aabb(): Readonly<Rect> {
		if (!this.isAABBComputed) {
			this.computeAABB()
		}
		return this.innerAABB
	}

	get stringPath() {
		if (!this.isStringPathComputed) {
			this.computeStringPath()
		}
		return this.innerStringPath
	}

	/**
	 * Gets style for this SVG element.
	 */
	get svgStyle(): React.CSSProperties {
		const res: React.CSSProperties = {}

		const { fill, stroke } = this.innerData

		if (fill) {
			res.fill = encodeColor(fill.color)
		} else {
			res.fill = "none"
		}

		res.stroke = encodeColor(stroke.color)
		res.strokeWidth = stroke.size
		res.strokeLinecap = stroke.linecap
		res.strokeLinejoin = stroke.linejoin

		return res
	}

	// TODO(teawithsand): methods for fast computations of collision point + methods for *fast* mutation of entries
}
