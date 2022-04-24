import { Color, Point, Size } from "../primitive"

export type CanvasStrokeCap = "butt" | "round" | "square"

export type CanvasDrawElementProperties = {
    action: "fill",
    strokeColor: Color,
    strokeSize: number,
    strokeCap: CanvasStrokeCap,

    fillColor: Color,
} | {
    action: "stroke",
    strokeColor: Color,
    strokeSize: number,
    strokeCap: CanvasStrokeCap,
}

/**
 * Element, which canvas knows how to draw.
 */
export type CanvasDrawElement = ({
    type: "path",
    points: Point[],
} | {
    type: "circle",
    center: Point,
    radius: number,
} | {
    type: "rect",
    ends: [Point, Point],
} | {
    type: "text",
    position: Point,
    text: string,
    maxWidth?: number,

    textAlign?: "center" | "left" | "right" | "end" | "start",

    font: string, // Font name to use
    size: Size, // size in px to write
} | {
    type: "polygon",
    points: Point[],
    autoClose?: boolean, // whether or not should be polygon last point closed to it's first one. False by default.
} | {
    type: "image", // raster image to embed 
    position: [Point, Point] | [Point], // rect to fit image to, or point that image should be mounted at using some other method
    image: string, // URL here. Data/object URLs are allowed 
}) & ({
    props: CanvasDrawElementProperties,
})

export default CanvasDrawElement