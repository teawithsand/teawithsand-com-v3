import { generateUUID } from "@app/util/lang/uuid";
import { Rect } from "../primitive";
import { rectContains } from "../primitive/calc";
import { AABBPaintElement, PointCollisionPaintElement } from "./PaintElement";
import PaintElementData from "./PaintElementData";

export type ImagePaintElementData = {
    url: string,
    rect: Rect,
} & PaintElementData

/**
 * Paint element, which denotes path, like SVG one.
 */
export default class ImagePaintElement implements AABBPaintElement<ImagePaintElementData>, PointCollisionPaintElement<ImagePaintElementData> {
    private innerRenderHash = generateUUID()

    constructor(private innerData: ImagePaintElementData) {
        // shallow copy, just to be sure
        this.innerData = {
            ...innerData,
        }
    }

    updateData = (updater: (data: ImagePaintElementData) => ImagePaintElementData): void => {
        this.innerData = updater(this.innerData)
        this.innerRenderHash = generateUUID()
    }

    checkCollision = (p: readonly [number, number]): boolean => {
        return rectContains(this.innerData.rect, p, true)
    }

    get renderHash() {
        return this.innerRenderHash
    }

    get data() {
        return this.innerData
    }

    get aabb(): Readonly<Rect> {
        return this.innerData.rect
    }
}