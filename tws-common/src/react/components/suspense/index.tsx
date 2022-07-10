import React, { FC, ReactNode, useMemo, useState } from "react"
import { SuspenseContext } from "tws-common/react/components/suspense/context"
import { SuspenseManager } from "tws-common/react/components/suspense/SuspenseManager"

export * from "./SuspenseManager"
export * from "./context"

/**
 * Suspense, which yields fallback if any of children has claimed that it's loading.
 * Otherwise, renders children.
 */
export const SimpleSuspense = (props: {
	fallback: FC<{}>
	children?: ReactNode
}) => {
	const { fallback: Fallback, children } = props

	const [ctr, setCtr] = useState(0)

	const manager = useMemo(() => new SuspenseManager(setCtr), [])

	return (
		<SuspenseContext.Provider value={manager}>
			{ctr === 0 ? children : <Fallback />}
		</SuspenseContext.Provider>
	)
}
