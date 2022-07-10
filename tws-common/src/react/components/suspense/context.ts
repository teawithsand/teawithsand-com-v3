import { Context, createContext, useContext } from "react"
import { SuspenseManager } from "tws-common/react/components/suspense/manager"

export type SimpleSuspenseContext = Context<SuspenseManager | null>

/**
 * SimpleSuspenseContext is to be used internally by suspense.
 * It's adviset that it should not be used by user manually.
 */
export const DefaultSimpleSuspenseContext: SimpleSuspenseContext =
	createContext<SuspenseManager | null>(null)

/**
 * Returns function, which creates suspense claim.
 */
export const useSimpleSuspenseManager = (
	context: SimpleSuspenseContext = DefaultSimpleSuspenseContext,
) => {
	const value = useContext(context)
	if (!value)
		throw new Error(
			"SimpleSuspense component is required as one of parents",
		)
	return value
}

/**
 * Returns function, which creates suspense claim.
 */
export const useOptionalSimpleSuspenseManager = (
	context: SimpleSuspenseContext = DefaultSimpleSuspenseContext,
): SuspenseManager | null => {
	const value = useContext(context)
	return value
}
