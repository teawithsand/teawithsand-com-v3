import { Point } from "../../primitive"
import PaintElement from "../PaintElement"
import PaintElementStroke from "../PaintElementStroke"
import PaintElementPostprocess from "../PaintElementPostprocess"

export default class PathPaintElement extends PaintElement {
    public postprocess: PaintElementPostprocess
    public points: Point[]
    public stroke: PaintElementStroke
    public renderId: string

    constructor(data: {
        points: Point[],
        stroke: PaintElementStroke,
        renderId: string,
        postprocess?: PaintElementPostprocess
    }) {
        super()

        this.points = data.points
        this.stroke = data.stroke
        this.renderId = data.renderId
        this.postprocess = data.postprocess ?? {}
    }
}