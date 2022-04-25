import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"
import PaintSceneManager from "../scene/PaintSceneManager"
import PaintUIInput from "./PaintUIInput"
import PaintUIState from "./PaintUIState"
import PaintTool from "./tool/PaintTool"

/**
 * Manager, which handles all UI, which comes with paint component.
 */
export default interface PaintUIManager {
    /**
     * PaintSceneManager used.
     * It can be accessed directly.
     */
    readonly paintSceneManager: PaintSceneManager

    /**
     * Bus, which emits event each time PaintUIstate changes.
     * Allows reading state as well.
     */
    readonly state: StickySubscribable<Readonly<PaintUIState>>

    /**
     * Handles UI input and takes some actions/updates current state.
     */
    handleInput(uiInput: PaintUIInput): void

    /**
     * Sets paint tool to use.
     */
    setTool(tool: PaintTool): void

    /**
     * Releases all resources that this manager used.
     */
    close(): void
}