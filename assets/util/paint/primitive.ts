import { Color } from "./color"
import { DrawSessionConsumer } from "./session"

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

export interface DrawSessionResult {
    /**
    * Makes sure that all pending resources are stopped.
    * Should be called after draw becomes obsolete because canvas is destroyed or another draw call is about to be called.
    * Call to this function does not undo changes made to draw target.
    */
    close(): void

    /**
     * True, if session was already closed.
     */
    readonly isClosed: boolean

    /**
     * True, if session was marked as infinite.
     */
    readonly isInfinite: boolean

    /**
     * Promise resolved once draw session is done.
     * Also resolved when session gets closed and all processes are finished.
     * For infinite sessions, resolved when session gets closed.
     */
    readonly donePromise: Promise<void>
}

export interface Draw {
    drawToSession(session: DrawSessionConsumer, elements: Iterable<DrawableElement>): void
}