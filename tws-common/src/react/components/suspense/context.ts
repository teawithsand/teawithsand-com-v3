import { createContext, useContext } from "react"
import { SuspenseManager } from "tws-common/react/components/suspense/SuspenseManager"

/**
 * SuspenseContext is to be used internally by suspense.
 * It's adviset that it should not be used by user manually.
 */
export const SuspenseContext = createContext<SuspenseManager | null>(null)

/**
 * Returns function, which creates suspense claim.
 */
export const useSimpleSuspenseManager = () => {
	const ctx = useContext(SuspenseContext)
	if (!ctx)
		throw new Error(
			"SimpleSuspense component is required as one of parents",
		)
	return ctx
}

/**
 * Returns function, which creates suspense claim.
 */
export const useOptionalSimpleSuspenseManager = (): SuspenseManager | null => {
	const ctx = useContext(SuspenseContext)
	return ctx
}
