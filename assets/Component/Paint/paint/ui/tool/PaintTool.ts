import PaintScene from "../../scene/PaintScene"
import PaintUIState from "../PaintUIState"
import ActivePaintTool from "./ActivePaintTool"
import PaintToolCallbacks from "./PaintToolCallbacks"

/**
 * Any paint tool, which user can use, in order to 
 */
export default interface PaintTool {
    activate(
        callbacks: PaintToolCallbacks,
        scene: Readonly<PaintScene>,
        state: Readonly<PaintUIState>,
    ): ActivePaintTool
}