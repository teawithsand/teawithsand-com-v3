import PaintElement from "../paint/PaintElement"
import { Point } from "../primitive"

/**
 * Transformer, which transforms each point individually.
 */
export type PointTransformer = (p: Point) => Point

/**
 * Transformer, which is able to transform drawable elements, rather than points.
 * It's a little bit more advanced, since it has to support things like circles defined via point 0 and radius and stuff.
 */
export type Transformer = (element: PaintElement) => PaintElement

export * from "./calc"
export * from "./rotate"
export * from "./translate"
export * from "./aabb"