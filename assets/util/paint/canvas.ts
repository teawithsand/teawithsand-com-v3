import { latePromise } from "../lang/latePromise";
import { encodeColor } from "./color";
import { FigureDrawOptions, FillOptions, DrawableElement, StrokeOptions, Draw } from "./primitive";
import { DrawSessionConsumer } from "./session";

export class CanvasDraw implements Draw {
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

    drawToSession = (session: DrawSessionConsumer, elements: Iterable<DrawableElement>) => {
        // TODO(teawithsand): if drawing infinite stuff, then it must be checked here

        session.addTask(async (chk) => {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        })

        for (const element of elements) {
            if (element.type === "rectangle") {
                session.addTask(async (chk) => {
                    if (chk.isClosed()) {
                        return
                    }

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
                })
            } else if (element.type === "circle") {
                session.addTask(async (chk) => {
                    if (chk.isClosed()) {
                        return
                    }

                    const [x, y] = element.point

                    this.initFigure(element.figureOptions)

                    this.ctx.beginPath()
                    this.ctx.arc(x, y, element.radius, 0, 2 * Math.PI)

                    this.finalizeFigure(element.figureOptions)
                })
            } else if (element.type === "path") {
                session.addTask(async (chk) => {
                    if (chk.isClosed()) {
                        return
                    }
                    this.applyStrokeOptions(element.strokeOptions)
                    this.ctx.beginPath()

                    // TODO(teawithsand): better drawing of single point polygon, which is not filled,
                    // which basically means that it's path
                    if (element.points.length === 1) {
                        const [x, y] = element.points[0]
                        this.ctx.arc(x, y, 1, 0, 2 * Math.PI)
                        this.finalizeFigure({
                            type: "fill",
                            fillOptions: {
                                color: element.strokeOptions.color,
                            },
                            strokeOptions: element.strokeOptions,
                        })
                    } else {
                        element.points.forEach((v, i) => {
                            const [x, y] = v
                            if (i === 0) {
                                this.ctx.moveTo(x, y)
                            } else {
                                this.ctx.lineTo(x, y)
                            }
                        })

                        this.finalizeFigure({
                            type: "stroke",
                            strokeOptions: element.strokeOptions,
                        })
                    }
                })
            } else if (element.type === "polygon") {
                session.addTask(async (chk) => {
                    if (chk.isClosed()) {
                        return
                    }
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
                })
            } else if (element.type === "image") {
                session.addTask(async (chk) => {
                    if (chk.isClosed()) {
                        return
                    }

                    const image = new Image()
                    const [promise, resolve, reject] = latePromise<void>()
                    image.onload = () => {
                        try {
                            // never apply changes if is closed already
                            if (chk.isClosed()) {
                                return;
                            }

                            if (element.position.length === 1) {
                                const [[x, y]] = element.position
                                this.ctx.drawImage(image, x, y)
                            } else {
                                const [[x, y], [dx, dy]] = element.position
                                this.ctx.drawImage(image, x, y, dx, dy)
                            }
                        } finally {
                            resolve()
                        }
                    }
                    image.onerror = (e) => {
                        reject(e)
                    }

                    image.src = element.image

                    await promise
                })
            }
        }
    }
}