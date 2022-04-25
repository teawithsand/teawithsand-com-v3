import { Point } from "../../primitive"
import PaintElement from "../PaintElement"
import PaintElementFill from "../PaintElementFill"
import PaintElementStroke from "../PaintElementStroke"

export default class PolygonPaintElement extends PaintElement {
    public points: Point[]
    public stroke: PaintElementStroke
    public fill: PaintElementFill | null
    public renderId: string
    public autoClose: boolean

    constructor(data: {
        points: Point[],
        stroke: PaintElementStroke,
        fill: PaintElementFill | null,
        renderId: string,
        autoClose: boolean,
    }) {
        super()

        this.points = data.points
        this.stroke = data.stroke
        this.fill = data.fill
        this.renderId = data.renderId
        this.autoClose = data.autoClose
    }
}