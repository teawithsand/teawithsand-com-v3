import PaintElementPostprocess from "./PaintElementPostprocess"

// TODO(teawithsand): make instances of this class immutable
export default abstract class PaintElement {
    abstract renderId: string
    abstract postprocess: PaintElementPostprocess
}