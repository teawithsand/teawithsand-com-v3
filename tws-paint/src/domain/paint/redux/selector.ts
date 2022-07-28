import { useSelector } from "react-redux"

import { PaintState } from "@app/domain/paint/redux/state"

/**
 * Typed version of useSelector for PaintState.
 */
export const usePaintSelector = <T>(selector: (state: PaintState) => T) =>
	useSelector(selector)
