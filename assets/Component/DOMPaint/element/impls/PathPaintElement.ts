import { Point } from "../../primitive"
import PaintElement from "../PaintElement"
import PaintElementStroke from "../PaintElementStroke"
import PaintElementTransform from "../PaintElementTransform"

export default class PathPaintElement extends PaintElement {
    public transform: PaintElementTransform[]
    public points: Point[]
    public stroke: PaintElementStroke
    public renderId: string

    constructor(data: {
        points: Point[],
        stroke: PaintElementStroke,
        renderId: string,
        transform?: PaintElementTransform[]
    }) {
        super()

        this.points = data.points
        this.stroke = data.stroke
        this.renderId = data.renderId
        this.transform = data.transform ?? []
    }
}