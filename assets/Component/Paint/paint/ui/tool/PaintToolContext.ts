import PaintScene from "../../scene/PaintScene";
import PaintUIState from "../PaintUIState";

export default class PaintToolContext {
    constructor(public readonly paintUIState: PaintUIState, scene: PaintScene) { }
}