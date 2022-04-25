import { Point } from "../../primitive"

export type PaintUIInput = {
    // Note: mouse events aren't delivered when user hovers mouse
    //  only when left mouse button is pressed
    //  or when user touches touch screen
    //  This behavior ensures compatibility with touch screen.
    type: "mouse",
    x: number,
    y: number,
    point: Point, // should be used in favour of x and y
    pressed: boolean,
} | {
    type: "setting-change",
    data: SettingChangeUIInput,
}

export type SettingChangeUIInput = {}

export default PaintUIInput