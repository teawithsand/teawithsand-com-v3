import DrawEvent from "../DrawEvent";
import UIState from "../UIState";

export default interface ActivePaintTool {
    submitUIState(state: UIState): void
    submitDrawEvent(event: DrawEvent): void
    close(): void
}