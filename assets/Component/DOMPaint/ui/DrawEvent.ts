import { Point } from "../primitive"

export type DrawEvent = {
    type: "mouse",
    point: Point,
    pressed: boolean,
}
export default DrawEvent