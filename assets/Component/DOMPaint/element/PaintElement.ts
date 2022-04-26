import PaintElementPostprocess from "./PaintElementPostprocess"

export default abstract class PaintElement {
    abstract renderId: string
    abstract postprocess: PaintElementPostprocess
}