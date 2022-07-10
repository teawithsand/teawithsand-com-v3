import { createContext, useContext } from "react"
import { ErrorWallManager } from "tws-common/react/components/error-wall/manager"

/**
 * SimpleSuspenseContext is to be used internally by suspense.
 * It's advised that it should not be used by user manually.
 */
export const ErrorWallContext = createContext<ErrorWallManager | null>(null)

export const useErrorWallManger = () => {
	const ctx = useContext(ErrorWallContext)
	if (!ctx)
		throw new Error("ErrorWall component is required as one of parents")
	return ctx
}

export const useOptionalErrorWallManager = (): ErrorWallManager | null => {
	const ctx = useContext(ErrorWallContext)
	return ctx
}
