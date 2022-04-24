import { CanvasSessionResult } from "./CanvasSession";
import CanvasDrawElement from "./CanvasDrawElement";

/**
 * Canvas is abstraction layer, which handles operations, which are most often done on HTML canvas.
 */
export default interface Canvas {
    /**
     * Resets canvas to it's initial state.
     */
    reset(): void

    /**
     * Draws element on canvas using session provided.
     */
    draw(elements: Iterable<CanvasDrawElement>): CanvasSessionResult
}
