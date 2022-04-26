import { Point } from "../../primitive"
import PaintElement from "../PaintElement"
import PaintElementFill from "../PaintElementFill"
import PaintElementStroke from "../PaintElementStroke"
import PaintElementTransform from "../PaintElementTransform"

export default class PolygonPaintElement extends PaintElement {
    public transform: PaintElementTransform[]
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
        transform?: PaintElementTransform[]
    }) {
        super()

        this.points = data.points
        this.stroke = data.stroke
        this.fill = data.fill
        this.renderId = data.renderId
        this.autoClose = data.autoClose
        this.transform = data.transform ?? []
    }
}