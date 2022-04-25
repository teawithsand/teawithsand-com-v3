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

        if (element.type === "path") {
            this.initFigure(element.props)(element.path)
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