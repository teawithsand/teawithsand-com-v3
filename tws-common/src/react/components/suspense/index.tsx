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
 * Suspense, which unmounts children until SimpleSuspenseManager is in idle state.
 */
export const SimpleSuspense = (props: {
	fallback: FC<{
		children?: ReactNode
	}>
	context?: SimpleSuspenseContext
	children?: ReactNode
}) => {
	return (
		<SimpleSuspenseDisplay
			{...props}
			display={props => {
				const { isFallbackActive, children } = props
				return <>{isFallbackActive ? null : children}</>
			}}
		/>
	)
}

/**
 * Suspense, which allows for customizations on how to hide inner children.
 * It may, but does not have to unmount innner components.
 */
export const SimpleSuspenseDisplay = (props: {
	fallback: FC<{
		children?: ReactNode
	}>
	context?: SimpleSuspenseContext
	display: FC<{
		isFallbackActive: boolean
		children?: ReactNode
	}>
	children?: ReactNode
}) => {
	const { fallback: Fallback, display: Display, children } = props

	const Context = props.context ?? DefaultSimpleSuspenseContext

	const parentManager = useOptionalSimpleSuspenseManager(Context)

	const [ctr, setCtr] = useState(0)

	const manager = useMemo(
		() => new SuspenseManager(parentManager, setCtr),
		[parentManager, setCtr],
	)

	return (
		<Context.Provider value={manager}>
			{ctr !== 0 ? <Fallback>{children}</Fallback> : null}
			<Display isFallbackActive={ctr !== 0}>{children}</Display>
		</Context.Provider>
	)
}
