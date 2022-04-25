import { Point } from "../../primitive"
import PaintElement from "../PaintElement"
import PaintElementStroke from "../PaintElementStroke"

export default class PathsPaintElement extends PaintElement {
    public paths: Point[][]
    public stroke: PaintElementStroke
    public renderId: string

    constructor(data: {
        paths: Point[][],
        stroke: PaintElementStroke,
        renderId: string,
    }) {
        super()

        this.paths = data.paths
        this.stroke = data.stroke
        this.renderId = data.renderId
    }
}