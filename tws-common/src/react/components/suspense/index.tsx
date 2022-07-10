import React, { FC, ReactNode, useMemo, useState } from "react"
import {
	DefaultSimpleSuspenseContext,
	SimpleSuspenseContext,
	useOptionalSimpleSuspenseManager,
} from "tws-common/react/components/suspense/context"
import { SuspenseManager } from "tws-common/react/components/suspense/manager"

export * from "./manager"
export * from "./context"

/**
 * Suspense, which yields fallback if any of children has claimed that it's loading.
 * Otherwise, renders children.
 */
export const SimpleSuspense = (props: {
	fallback: FC<{}>
	context?: SimpleSuspenseContext
	children?: ReactNode
}) => {
	const { fallback: Fallback, children } = props

	const Context = props.context ?? DefaultSimpleSuspenseContext

	const parentManager = useOptionalSimpleSuspenseManager(Context)

	const [ctr, setCtr] = useState(0)

	const manager = useMemo(
		() => new SuspenseManager(parentManager, setCtr),
		[parentManager, setCtr],
	)

	return (
		<Context.Provider value={manager}>
			{ctr === 0 ? children : <Fallback />}
		</Context.Provider>
	)
}
