import { AnyAction } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

import { ABookStore, useABookStore } from "@app/domain/abook/ABookStore"

export type ProcedureContext = {
	abookStore: ABookStore
	dispatch: (action: AnyAction) => void
}

/**
 * Hook, which simplifies creating PC in react.
 */
export const useProcedureContext = (): ProcedureContext => {
	return {
		abookStore: useABookStore(),
		dispatch: useDispatch(),
	}
}

export type Procedure<T> = (ctx: ProcedureContext, data: T) => Promise<void>
