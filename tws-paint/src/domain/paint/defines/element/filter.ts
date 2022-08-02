export enum PaintFilterType {
	SCALE = "scale",
}

export type PaintFilter = {
	type: PaintFilterType.SCALE
	factorX: number
	factorY: number
}
