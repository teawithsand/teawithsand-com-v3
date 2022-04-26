import { Point } from "../../primitive"
import PaintElement from "../PaintElement"
import PaintElementStroke from "../PaintElementStroke"
import PaintElementTransform from "../PaintElementTransform"

export default class PathsPaintElement extends PaintElement {
    public transform: PaintElementTransform[]
    public paths: Point[][]
    public stroke: PaintElementStroke
    public renderId: string

    constructor(data: {
        paths: Point[][],
        stroke: PaintElementStroke,
        renderId: string,
        transform?: PaintElementTransform[]
    }) {
        super()

        this.paths = data.paths
        this.stroke = data.stroke
        this.renderId = data.renderId
        this.transform = data.transform ?? []
    }
}