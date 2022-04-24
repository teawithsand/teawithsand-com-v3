import PaintManagerMutation from "../../scene/mutation/PaintManagerMutation";
import PaintUIState from "../PaintUIState";
import PaintToolCallbacks from "./PaintToolCallbacks";
import PaintToolInput from "./PaintToolInput";
import PaintToolInputResult from "./PaintToolInputResult";

export default interface ActivePaintTool {
    readonly callbacks: PaintToolCallbacks

    /**
     * Updates UI state, 
     */
    updateUIState(state: PaintUIState): void

    /**
     * Processes input from canvas.
     */
    processInput(input: PaintToolInput): PaintToolInputResult

    /**
     * Returns mutations, which can be applied to PaintManager.
     */
    getMutations(): PaintManagerMutation[]

    /**
     * Called in order to allow APT to cleanup it's resources.
     * After this call, no call to other APT functions will be done.
     */
    close(): void
}