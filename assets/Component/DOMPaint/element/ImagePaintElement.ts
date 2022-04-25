import { Rect } from "../primitive";
import PaintElement from "./PaintElement";

export type ObjectFit =
    "contain" |
    "cover" |
    "fill" |
    "none" |
    "scale-down"

export default class ImagePaintElement extends PaintElement {
    public url: string
    public renderId: string
    public rect: Rect
    public objectFit: ObjectFit

    constructor(data: {
        url: string,
        renderId: string,
        rect: Rect,
        objectFit: ObjectFit,
    }) {
        super()

        this.renderId = data.renderId
        this.url = data.url
        this.rect = data.rect
        this.objectFit = data.objectFit
    }
}