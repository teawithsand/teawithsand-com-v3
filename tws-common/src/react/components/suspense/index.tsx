import React, { FC, ReactNode, useMemo, useState } from "react"
import styled from "styled-components"
import {
	DefaultSimpleSuspenseContext,
	SimpleSuspenseContext,
	useOptionalSimpleSuspenseManager,
} from "tws-common/react/components/suspense/context"
import { SimpleSuspenseManager } from "tws-common/react/components/suspense/manager"

export * from "./manager"
export * from "./context"

export interface OpinionatedSimpleSupenseProps {
	fallback: FC<{
		children?: ReactNode
	}>
	context?: SimpleSuspenseContext
	children?: ReactNode

	// FIXME(teaiwthsand): fix no parent manager issue when there is a proposed manager...
	manager?: SimpleSuspenseManager
}

export interface SimpleSuspenseProps extends OpinionatedSimpleSupenseProps {
	display: FC<{
		isFallbackActive: boolean
		children?: ReactNode
	}>
}

/**
 * Suspense, which unmounts children until SimpleSuspenseManager is in idle state.
 */
export const SimpleSuspense = (props: OpinionatedSimpleSupenseProps) => {
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

type SuspendParentProps = {
	$isFallbackActive: boolean
}

const SuspendParent = styled.div.attrs<SuspendParentProps>(props => ({
	style: {
		display: props.$isFallbackActive ? "none" : "block",
	},
}))<SuspendParentProps>``

/**
 * SimpleSuspense, which uses div with display: none for loading.
 */
export const SimpleSuspenseDiv = (props: OpinionatedSimpleSupenseProps) => {
	return (
		<SimpleSuspenseDisplay
			{...props}
			display={({ isFallbackActive, children }) => (
				<SuspendParent $isFallbackActive={isFallbackActive}>
					{children}
				</SuspendParent>
			)}
		/>
	)
}

/**
 * Suspense, which allows for customizations on how to hide inner children.
 * It may, but does not have to unmount innner components.
 */
export const SimpleSuspenseDisplay = (props: SimpleSuspenseProps) => {
	const {
		fallback: Fallback,
		display: Display,
		children,
		manager: proposedManager,
	} = props

	const Context = props.context ?? DefaultSimpleSuspenseContext

	const parentManager = useOptionalSimpleSuspenseManager(Context)

	const [ctr, setCtr] = useState(0)

	const manager = useMemo(
		() =>
			proposedManager ?? new SimpleSuspenseManager(parentManager, setCtr),
		[parentManager, setCtr, proposedManager],
	)

	return (
		<Context.Provider value={manager}>
			{ctr !== 0 ? <Fallback>{children}</Fallback> : null}
			<Display isFallbackActive={ctr !== 0}>{children}</Display>
		</Context.Provider>
	)
}
