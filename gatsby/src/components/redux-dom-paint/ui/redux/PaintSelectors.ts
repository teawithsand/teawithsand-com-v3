import PaintState from "@app/components/redux-dom-paint/ui/redux/PaintState"
import { useSelector } from "react-redux"

/**
 * Typed wrapper over useSelector from react-redux.
 */
export const usePaintStateSelector = <T>(selector: (ps: PaintState) => T) => useSelector<PaintState, T>(selector)