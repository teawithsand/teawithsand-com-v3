import { Context, createContext, useContext } from "react";
import { ErrorWallManager } from "tws-common/react/components/error-wall/manager";


export type ErrorWallContext = Context<ErrorWallManager | null>

/**
 * SimpleSuspenseContext is to be used internally by suspense.
 * It's advised that it should not be used by user manually.
 * 
 * @deprecated use new suspense/error boundary/react-query instead
 */
export const DefaultErrorWallContext = createContext<ErrorWallManager | null>(
	null,
)

/**
 * @deprecated use new suspense/error boundary/react-query instead
 */
export const useErrorWallManger = (
	context: ErrorWallContext = DefaultErrorWallContext,
) => {
	const value = useContext(context)
	if (!value)
		throw new Error("ErrorWall component is required as one of parents")
	return value
}

/**
 * @deprecated use new suspense/error boundary/react-query instead
 */
export const useOptionalErrorWallManager = (
	context: ErrorWallContext = DefaultErrorWallContext,
): ErrorWallManager | null => {
	const value = useContext(context)
	return value
}