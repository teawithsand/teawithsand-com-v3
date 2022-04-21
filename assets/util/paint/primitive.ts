import { Color } from "./color"

/**
 * Point encoded with x and y coordinates.
 * Point [0, 0] is in top left corner.
 */
export type Point = [number, number]

export interface StrokeOptions {
    size: number,
    color: Color,
}

export interface FillOptions {
    color: Color,
}

export type FigureDrawOptions = {
    type: "fill",
    fillOptions: FillOptions,
    strokeOptions: StrokeOptions,
} | {
    type: "stroke", // do not fill figure
    strokeOptions: StrokeOptions,
}

/**
 * Any type, which can be painted onto HTML canvas.
 */
 export type DrawableElement = {
    type: "rectangle",
    points: [Point, Point],
    figureOptions: FigureDrawOptions,
} | {
    type: "circle",
    point: Point,
    radius: number,
    figureOptions: FigureDrawOptions,
} | {
    type: "path",
    ends: [Point, Point],
    strokeOptions: StrokeOptions,
} | {
    type: "polygon",
    points: Point[],
    figureOptions: FigureDrawOptions,
} | {
    type: "image", // raster image to embed 
    position: [Point, Point] | [Point], // rect to fit image to, or point that image should be mounted at using some other method
    image: string, // URL here. Data/object URLs are allowed 
}

export interface DrawResult {
    // Makes sure that all pending resources are stopped.
    // Should be called after draw becomes obsolete because canvas is destroyed or another draw call is about to be called.
    // Call to this function does not undo changes made to draw target.
    close(): void
}

export interface Draw {
    drawElement(element: DrawableElement): DrawResult
}