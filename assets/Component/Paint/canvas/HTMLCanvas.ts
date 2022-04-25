import { latePromise } from "@app/util/lang/latePromise";
import { TaskQueue } from "@app/util/lang/taskQueue";
import { encodeColor, pointEquals } from "../primitive";
import Canvas from "./Canvas";
import CanvasDrawElement, { CanvasDrawElementProperties } from "./CanvasDrawElement";
import { CanvasSessionClosedChecker, CanvasSessionResult } from "./CanvasSession";

export type HTMLCanvasProps = {
    width: number,
    height: number,
    cssWidth?: number,
    cssHeight?: number,
}

export default class HTMLCanvas implements Canvas {
    constructor(private readonly canvas: HTMLCanvasElement) {
    }
    private readonly ctx = this.canvas.getContext("2d", {
        alpha: true,
        // willReadFrequently: false,
    })

    private readonly queue = new TaskQueue()

    reset = (): void => {
        this.queue.clearQueue()

        // TODO(teawithsand): this is buggy stuff.
        //  Queue may be canceled again before another task is scheduled
        this.queue.scheduleTask(async () => {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        })
    }

    draw = (elements: Iterable<CanvasDrawElement>): CanvasSessionResult => {
        let ctr = 0

        let p = Promise.resolve()
        let isClosed = false
        for (const e of elements) {
            ctr += 1

            const chk = new CanvasSessionClosedChecker(() => isClosed)
            /*
            p.push(this.queue.scheduleTask(async () => {
                
            }))
            */
            p = p.then(() => this.innerPlotElement(e, chk))
        }

        // const donePromise = Promise.all(p)
        //     .then(() => { }) // fix return type

        const donePromise = p

        return {
            donePromise,
            close: () => {
                isClosed = true
            },
            get isClosed() {
                return isClosed
            }
        }
    }

    private initFigure = (props: CanvasDrawElementProperties) => {
        // initializer

        this.ctx.lineCap = props.strokeCap
        this.ctx.strokeStyle = encodeColor(props.strokeColor)
        this.ctx.lineWidth = props.strokeSize
        if (props.action === "fill") {
            this.ctx.fillStyle = encodeColor(props.fillColor)
        }

        return (path?: Path2D) => {
            if (props.action === "fill") {
                if (path) {
                    this.ctx.fill(path)
                } else {
                    this.ctx.fill()
                }
            } else {
                if (path) {
                    this.ctx.stroke(path)
                } else {
                    this.ctx.stroke()
                }
            }
        }
    }

    private innerPlotElement = async (element: CanvasDrawElement, chk: CanvasSessionClosedChecker) => {
        if (chk.isClosed()) {
            return
        }

        if (element.type === "rect") {
            if (chk.isClosed()) {
                return
            }

            const [p1, p2] = element.ends

            const [x1, y1] = p1
            const [x2, y2] = p2

            const p = new Path2D()
            p.moveTo(x1, y1)
            p.lineTo(x1, y2)
            p.lineTo(x2, y2)
            p.lineTo(x2, y1)
            p.lineTo(x1, y1)

            this.initFigure(element.props)(p)
        } else if (element.type === "circle") {
            const [x, y] = element.center

            const p = new Path2D()
            p.arc(x, y, element.radius, 0, 2 * Math.PI)

            this.initFigure(element.props)(p)
        } else if (element.type === "path") {
            const p = new Path2D()
            element.points.forEach((v, i) => {
                const [x, y] = v
                if (i === 0) {
                    p.moveTo(x, y)
                } else {
                    p.lineTo(x, y)
                }
            })

            this.initFigure(element.props)(p)
        } else if (element.type === "polygon") {
            const p = new Path2D()
            element.points.forEach((v, i) => {
                const [x, y] = v
                if (i === 0) {
                    p.moveTo(x, y)
                } else {
                    p.lineTo(x, y)
                }
            })

            if (element.autoClose) {
                if (!pointEquals(element.points[0], element.points[element.points.length - 1])) {
                    p.lineTo(element.points[0][0], element.points[0][1])
                }
            }

            this.initFigure(element.props)(p)
        } else if (element.type === "image") {
            const image = new Image()
            const [promise, resolve, reject] = latePromise<void>()
            image.onload = () => {
                try {
                    // never apply changes if is closed already
                    if (chk.isClosed()) {
                        return;
                    }

                    const [[x, y], [dx, dy]] = element.position
                    this.ctx.drawImage(image, x, y, dx, dy)
                } finally {
                    resolve()
                }
            }
            image.onerror = (e) => {
                reject(e)
            }

            image.src = element.image

            await promise
        } else if (element.type === "text") {
            if (chk.isClosed()) {
                return
            }

            this.ctx.font = `${element.size}px ${element.font}`
            this.ctx.textAlign = element.textAlign ?? "start"
            this.ctx.fillText(element.text, element.position[0], element.position[1], element.maxWidth)
        } else {
            throw new Error("unreachable code")
        }
    }
}