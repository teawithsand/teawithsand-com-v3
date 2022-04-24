import PaintElement from "../../PaintElement";
import PaintManagerMutation from "./PaintManagerMutation";

export default class AppendPaintManagerMutation extends PaintManagerMutation {
    constructor(public readonly appendElements: PaintElement[]) {
        super()
    }
}