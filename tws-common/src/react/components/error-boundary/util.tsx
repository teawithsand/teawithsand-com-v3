import React, { PropsWithChildren } from "react"
import { QueryErrorResetBoundary } from "react-query"

import { ErrorBoundary, ErrorBoundaryProps } from "./boundary"

/**
 * Boundary, which merges QueryErrorResetBoundary and ErrorBoundary into single component.
 */
export const ComposedErrorBoundary = (
	props: PropsWithChildren<
		ErrorBoundaryProps & {
			onReset?: undefined
			onError?: undefined
		}
	>,
) => {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					{...props}
					onReset={reset}
				/>
			)}
		</QueryErrorResetBoundary>
	)
}
