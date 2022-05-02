import { AABBPaintElement, PointCollisionPaintElement } from "@app/components/dom-paint/element/PaintElement";
import PaintElementData from "@app/components/dom-paint/element/PaintElementData";
import { Rect } from "@app/components/redux-dom-paint/primitive";
import { rectContains } from "@app/components/redux-dom-paint/primitive/calc";
import { generateUUID } from "@app/util/lang/uuid";

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