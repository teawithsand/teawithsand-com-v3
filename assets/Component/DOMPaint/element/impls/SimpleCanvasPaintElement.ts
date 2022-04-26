import PaintElement from "../PaintElement"
import PaintElementTransform from "../PaintElementTransform"

export default class SimpleCanvasPaintElement extends PaintElement {
    public transform: PaintElementTransform[]
    public renderId: string
    public renderer: (ctx: CanvasRenderingContext2D) => void

    constructor(data: {
        renderId: string,
        renderer: (ctx: CanvasRenderingContext2D) => void,
        transform?: PaintElementTransform[],
    }) {
        super()

        this.renderId = data.renderId
        this.renderer = data.renderer
        this.transform = data.transform ?? []
    }
}