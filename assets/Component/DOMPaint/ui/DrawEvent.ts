import { Point } from "../primitive"

export type DrawEvent = {
    type: "mouse",
    // Absolute canvas coordinates, after applying scroll correction
    canvasPoint: Point,
    screenPoint: Point,
    pressed: boolean,
}
export default DrawEvent