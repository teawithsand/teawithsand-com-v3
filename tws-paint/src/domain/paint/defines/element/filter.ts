import { CSSProperties } from "react"

export enum PaintFilterType {
	SCALE = "scale",
	OPACITY = "opacity",
}

export type PaintFilter =
	| {
			type: PaintFilterType.SCALE
			factorX: number
			factorY: number
	  }
	| {
			type: PaintFilterType.OPACITY
			factor: number // between 0 and 1
	  }

const renderFilterForFilter = (filter: PaintFilter): string => {
	if (filter.type === PaintFilterType.OPACITY) {
		return `opacity(${filter.factor * 100}%)`
	} else if (filter.type === PaintFilterType.SCALE) {
		return "" // it's for transform
	}
	{
		throw new Error(`Unknown filter type ${(filter as any).type}`)
	}
}

const renderFilterForTransform = (filter: PaintFilter): string => {
	if (filter.type === PaintFilterType.OPACITY) {
		return ""
	} else if (filter.type === PaintFilterType.SCALE) {
		return `scale(${filter.factorX}, ${filter.factorY})`
	}
	{
		throw new Error(`Unknown filter type ${(filter as any).type}`)
	}
}

/**
 * Renders array of paint filter to CSS props..
 */
export const renderPaintFilters = (
	filters: PaintFilter[],
): {
	filter: CSSProperties["filter"]
	transform: CSSProperties["transform"]
} => {
	return {
		filter: filters
			.map(v => renderFilterForFilter(v))
			.filter(v => !!v)
			.join(" "),
		transform: filters
			.map(v => renderFilterForTransform(v))
			.filter(v => !!v)
			.join(" "),
	}
}
