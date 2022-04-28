import { Point } from "../primitive"

export type DrawEvent = {
    type: "mouse",
    // Absolute canvas coordinates, after applying scroll correction
    canvasPoint: Point,
    screenPoint: Point,
    pressed: boolean,
} | {
    type: "scroll",
    scrollWidth: number,
    scrollHeight: number,
    scrollX: number,
    scrollY: number,
} | {
    type: "element-clicked",
    layerIndex: number,
    elementIndex: number,
    sceneRenderId: string,
}
export default DrawEvent