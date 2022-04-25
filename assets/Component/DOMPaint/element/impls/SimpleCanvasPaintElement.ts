import PaintElement from "../PaintElement"

export default class SimpleCanvasPaintElement extends PaintElement {
    public renderId: string
    public renderer: (ctx: CanvasRenderingContext2D) => void

    constructor(data: {
        renderId: string,
        renderer: (ctx: CanvasRenderingContext2D) => void,
    }) {
        super()

        this.renderId = data.renderId
        this.renderer = data.renderer
    }
}