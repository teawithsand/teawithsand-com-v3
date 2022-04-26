import PaintElementTransform from "./PaintElementTransform"

export default abstract class PaintElement {
    abstract renderId: string
    abstract transform: PaintElementTransform[]
}