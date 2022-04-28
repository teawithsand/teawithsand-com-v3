import UIState from "./GlobalUIState";

/**
 * Function, which changes ui state it's given into new one.
 */
type UIStateMutator = (state: UIState) => void
export default UIStateMutator