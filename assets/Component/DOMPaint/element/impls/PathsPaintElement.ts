import { Point } from "../../primitive"
import PaintElement from "../PaintElement"
import PaintElementStroke from "../PaintElementStroke"
import PaintElementPostprocess from "../PaintElementPostprocess"

export default class PathsPaintElement extends PaintElement {
    public postprocess: PaintElementPostprocess
    public paths: Point[][]
    public stroke: PaintElementStroke
    public renderId: string

    constructor(data: {
        paths: Point[][],
        stroke: PaintElementStroke,
        renderId: string,
        postprocess?: PaintElementPostprocess
    }) {
        super()

        this.paths = data.paths
        this.stroke = data.stroke
        this.renderId = data.renderId
        this.postprocess = data.postprocess ?? {}
    }
}