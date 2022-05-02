import { Point } from "../../../redux-dom-paint/primitive"
import PaintSceneElementLocator from "./PaintSceneElementLocator"



/**
 * PaintScene, which can be queried for some stuff like elements for boxes and stuff.
 */
export default interface PaintSceneQuery {
    /**
     * Gets topmost element for specified point or null if there is none at given coordinates.
     */
    getFirstElementAtPoint(p: Point): PaintSceneElementLocator | null
}