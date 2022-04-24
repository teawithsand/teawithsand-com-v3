import PaintElement from "../../PaintElement";
import PaintManagerMutation from "./PaintManagerMutation";

export default class ReplacePaintManagerMutation extends PaintManagerMutation {
    constructor(
        public readonly replacementMap: Map<number,
            Map<number, PaintElement[]>
        >,
    ) {
        super()
    }
}