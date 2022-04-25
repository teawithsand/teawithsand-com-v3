import { Point } from "../../primitive"
import PaintElement from "../PaintElement"
import PaintElementStroke from "../PaintElementStroke"

export default class PathPaintElement extends PaintElement {
    public points: Point[]
    public stroke: PaintElementStroke
    public renderId: string

    constructor(data: {
        points: Point[],
        stroke: PaintElementStroke,
        renderId: string,
    }) {
        super()

        this.points = data.points
        this.stroke = data.stroke
        this.renderId = data.renderId
    }
}