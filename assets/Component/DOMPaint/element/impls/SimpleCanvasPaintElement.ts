import PaintElement from "../PaintElement"
import PaintElementPostprocess from "../PaintElementPostprocess"

export default class SimpleCanvasPaintElement extends PaintElement {
    public postprocess: PaintElementPostprocess
    public renderId: string
    public renderer: (ctx: CanvasRenderingContext2D) => void

    constructor(data: {
        renderId: string,
        renderer: (ctx: CanvasRenderingContext2D) => void,
        postprocess?: PaintElementPostprocess,
    }) {
        super()

        this.renderId = data.renderId
        this.renderer = data.renderer
        this.postprocess = data.postprocess ?? {}
    }
}