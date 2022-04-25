import PaintElement from "../../PaintElement";
import PaintManagerMutation from "./PaintManagerMutation";

/**
 * Creates new topmost layer with following elements.
 */
export default class AppendPaintManagerMutation extends PaintManagerMutation {
    constructor(
        public readonly appendElements: PaintElement[],
    ) {
        super()
    }
}