import GlobalUIState from "@app/components/dom-paint/ui/state/GlobalUIState"

/**
 * Function, which changes ui state it's given into new one.
 */
type GlobalUIStateMutation = (state: GlobalUIState) => void
export default GlobalUIStateMutation