import { AABBPaintElement, PointCollisionPaintElement } from "@app/components/dom-paint/element/PaintElement";
import PaintElementData from "@app/components/dom-paint/element/PaintElementData";
import { Color, encodeColor, Point, Rect } from "@app/components/dom-paint/primitive";
import { rectContains } from "@app/components/dom-paint/primitive/calc";
import { generateUUID } from "@app/util/lang/uuid";

export type TextPaintElementData = {
    text: string,
    color: Color,
    startPoint: Point,

    dominantBaseline: "auto" | "text-bottom" | "alphabetic" | "ideographic" | "middle" | "central" | "mathematical" | "hanging" | "text-top",

    fontName: string,
    fontSize: number,

    length: number | null,
    lengthAdjust: number | null,
    glyphRotate: number | null,
} & PaintElementData

export const textPaintElementDataDefaults = (): TextPaintElementData => ({
    text: "",
    color: [0,0,0],
    startPoint: [0,0],
    dominantBaseline: "auto",
    fontName: "monospace",
    filters: [],
    fontSize: 20,
    glyphRotate: null,
    length: null,
    lengthAdjust: null,
})

const canvas = document.createElement("canvas") as HTMLCanvasElement
canvas.width = 1
canvas.height = 1
const context = canvas.getContext("2d") as CanvasRenderingContext2D

/**
 * Paint element, which denotes path, like SVG one.
 */
export default class TextPaintElement implements AABBPaintElement<TextPaintElementData>, PointCollisionPaintElement<TextPaintElementData> {
    private innerRenderHash = generateUUID()
    private innerAABB: Rect | null = null

    constructor(private innerData: TextPaintElementData) {
        // shallow copy, just to be sure
        this.innerData = {
            ...innerData,
        }
    }

    updateData = (updater: (data: TextPaintElementData) => TextPaintElementData): void => {
        this.innerData = updater(this.innerData)
        this.innerRenderHash = generateUUID()
    }

    checkCollision = (p: readonly [number, number]): boolean => {
        return rectContains(this.aabb, p, true)
    }

    get renderHash() {
        return this.innerRenderHash
    }

    get data() {
        return this.innerData
    }

    private get formattedFont() {
        return `${this.innerData.fontSize}px ${this.innerData.fontName}`
    }

    private computeAABB() {
        context.font = this.formattedFont
        context.fillStyle = "rgb(0,0,0)"
        const metrics = context.measureText(this.innerData.text)
        const width = this.innerData.length ?? metrics.width

        const aabb: Rect = [
            [...this.innerData.startPoint],
            [
                this.innerData.startPoint[0] + width,
                this.innerData.startPoint[1] + this.innerData.fontSize,
            ]
        ]

        this.innerAABB = aabb
        return aabb
    }

    get aabb(): Readonly<Rect> {
        if (this.innerAABB) {
            return this.innerAABB
        }
        this.computeAABB()
        return this.innerAABB as unknown as Rect
    }

    /**
     * Gets style for this SVG element.
     */
    get svgStyle(): React.CSSProperties {
        const res: React.CSSProperties = {}
        res.color = encodeColor(this.innerData.color)
        res.font = this.formattedFont
        return res
    }
}