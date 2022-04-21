import { ThemeProvider } from "react-bootstrap";
import { encodeColor } from "./color";
import { FigureDrawOptions, FillOptions, PaintElement, StrokeOptions } from "./primitive";

export class CanvasDraw {
    constructor(private readonly ctx: CanvasRenderingContext2D) {
    }

    private applyStrokeOptions = (options: StrokeOptions) => {
        this.ctx.strokeStyle = encodeColor(options.color)
        this.ctx.lineWidth = options.size
    }

    private applyFillOptions = (options: FillOptions) => {
        this.ctx.fillStyle = encodeColor(options.color)
    }

    private initFigure = (options: FigureDrawOptions) => {
        if (options.type === "fill") {
            this.applyFillOptions(options.strokeOptions)
            this.ctx.fill()
        } else {
            this.applyStrokeOptions(options.strokeOptions)
            this.ctx.stroke()
        }
    }

    private finalizeFigure = (options: FigureDrawOptions) => {
        if (options.type === "fill") {
            this.ctx.fill()
            this.ctx.stroke()
        } else {
            this.ctx.stroke()
        }
    }


    drawElement = (element: PaintElement) => {
        if (element.type === "rectangle") {
            const [p1, p2] = element.points

            const [x1, y1] = p1
            const [x2, y2] = p2

            this.initFigure(element.figureOptions)

            this.ctx.beginPath()
            this.ctx.moveTo(x1, y1)

            this.ctx.lineTo(x1, y2)
            this.ctx.lineTo(x2, y2)
            this.ctx.lineTo(x2, y1)
            this.ctx.lineTo(x1, y1)

            this.finalizeFigure(element.figureOptions)
        } else if (element.type === "circle") {
            const [x, y] = element.point

            this.initFigure(element.figureOptions)

            this.ctx.beginPath()
            this.ctx.arc(x, y, element.radius, 0, 2 * Math.PI)

            this.finalizeFigure(element.figureOptions)
        } else if (element.type === "path") {
            const [[x1, y1], [x2, y2]] = element.ends

            this.ctx.beginPath()
            this.ctx.moveTo(x1, y1)
            this.ctx.lineTo(x2, y2)
            this.ctx.stroke()
        } else if (element.type === "polygon") {
            this.initFigure(element.figureOptions)

            this.ctx.beginPath()

            element.points.forEach((v, i) => {
                const [x, y] = v
                if (i === 0) {
                    this.ctx.moveTo(x, y)
                } else {
                    this.ctx.lineTo(x, y)
                }
            })

            this.finalizeFigure(element.figureOptions)
        } else if (element.type === "image") {
            const image = new Image()
            image.src = element.image

            if (element.position.length === 1) {
                const [[x, y]] = element.position
                this.ctx.drawImage(image, x, y)
            } else {
                const [[x, y], [dx, dy]] = element.position
                this.ctx.drawImage(image, x, y, dx, dy)
            }
        }
    }
}

/*

export const fillOptionsAsPath = (ctx: CanvasRenderingContext2D, options: PathOptions) => {
    switch (options.type) {
        case "fill":
            ctx.fillStyle = encodeColor(options.fillColor)
            ctx.strokeStyle = encodeColor(options.strokeColor)
            break;
    }
}

/**
 * Applies paint element onto 2d canvas.
 * /
 export const executePaintElementOnCanvas = (ctx: CanvasRenderingContext2D, element: PaintElement) => {
    switch (element.type) {
        case "rectangle":
            const [p1, p2] = element.points
            // const x = Math.min(p1[0], p2[0])
            // const y = Math.min(p1[1], p2[1])
            // const w = Math.abs(p1[0] - p2[0])
            // const h = Math.abs(p1[1] - p2[1])

            // applyFillOptionsToCanvas(ctx, element.fill)

            // ctx.fillRect(x, y, w, h)

            const [x1, y1] = p1
            const [x2, y2] = p2

            ctx.beginPath()
            ctx.moveTo(x1, y1)

            // draw rect
            ctx.lineTo(x1, y2)
            ctx.lineTo(x2, y2)
            ctx.lineTo(x2, y1)
            ctx.lineTo(x1, y1)

            ctx.fill()
            break;
    }
}
*/

