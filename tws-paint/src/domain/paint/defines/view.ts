export type PaintViewOptions = {
	// Target render container size. Usually screen size.
	viewportWidth: number
	viewportHeight: number

	// Offsets used for user-based canvas dragging
	offsetX: number
	offsetY: number

	zoomFactor: number
}
