export enum PaintScreenEventType {
	POINTER_DOWN = "pointer-down",
	POINTER_UP = "pointer-up",
	POINTER_MOVE = "pointer-move",
}

export type AnyCursorEvent = MouseEvent | TouchEvent | PointerEvent

/**
 * Any event, which is generated by SceneRenderer or it's parent - container having the whole screen.
 */
export type PaintScreenEvent = {
	type:
		| PaintScreenEventType.POINTER_DOWN
		| PaintScreenEventType.POINTER_MOVE
		| PaintScreenEventType.POINTER_UP
	event: AnyCursorEvent
}

export enum PaintEventType {
	SCREEN = "screen",
}

/**
 * Any event generated by user.
 *
 * For internal events use redux state manager, as it's more suitable for this purpose.
 * Also for now there is no such thing as internal event. There is only state.
 */
export type PaintEvent = {
	type: PaintEventType.SCREEN
	screenEvent: PaintScreenEvent
}
