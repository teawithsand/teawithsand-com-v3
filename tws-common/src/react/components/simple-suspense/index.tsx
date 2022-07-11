import React, { FC, ReactNode, useMemo } from "react";
import styled from "styled-components";
import { DefaultSimpleSuspenseContext, SimpleSuspenseContext, useOptionalSimpleSuspenseManager } from "tws-common/react/components/simple-suspense/context";
import { SimpleSuspenseManager } from "tws-common/react/components/simple-suspense/manager";
import useStickySubscribable from "tws-common/react/hook/useStickySubscribable";


export * from "./context"
export * from "./manager"

/**
 * @deprecated use new suspense/error boundary/react-query instead
 */
export interface OpinionatedSimpleSupenseProps {
	fallback: FC<{
		children?: ReactNode
	}>
	context?: SimpleSuspenseContext
	children?: ReactNode

	// FIXME(teaiwthsand): fix no parent manager issue when there is a proposed manager...
	manager?: SimpleSuspenseManager
}

/**
 * @deprecated use new suspense/error boundary/react-query instead
 */
export interface SimpleSuspenseProps extends OpinionatedSimpleSupenseProps {
	display: FC<{
		isFallbackActive: boolean
		children?: ReactNode
	}>
}

/**
 * Suspense, which unmounts children until SimpleSuspenseManager is in idle state.
 * 
 * @deprecated use new suspense/error boundary/react-query instead
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
 * 
 * @deprecated use new suspense/error boundary/react-query instead
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
 * 
 * @deprecated use new suspense/error boundary/react-query instead
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

	const manager = useMemo(
		() => proposedManager ?? new SimpleSuspenseManager(parentManager),
		[parentManager, proposedManager],
	)

	const isClaimed = useStickySubscribable(manager.claimCountBus) > 0

	return (
		<Context.Provider value={manager}>
			{isClaimed ? <Fallback>{children}</Fallback> : null}
			<Display isFallbackActive={isClaimed}>{children}</Display>
		</Context.Provider>
	)
}