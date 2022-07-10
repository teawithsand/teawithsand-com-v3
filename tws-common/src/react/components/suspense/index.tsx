import React, { FC, ReactNode, useMemo, useState } from "react"
import styled from "styled-components"
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

type IProps = {
	$isFallbackActive: boolean
}

const SuspendParent = styled.div.attrs<IProps>(props => ({
	style: {
		display: props.$isFallbackActive ? "none" : "block",
	},
}))<IProps>``

/**
 * SimpleSuspense, which uses div with display: none for loading.
 */
export const SimpleSuspenseDiv = (props: {
	fallback: FC<{
		children?: ReactNode
	}>
	context?: SimpleSuspenseContext
	children?: ReactNode
}) => {
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

/*import React, { ReactElement, ReactFragment, ReactNode } from "react"
import styled from "styled-components"

import AppNavbar from "@app/components/layout/Navbar"

import { GlobalIdManager } from "tws-common/misc/GlobalIDManager"
import { DialogBoundary } from "tws-common/react/components/dialog"
import { SimpleSuspenseDisplay } from "tws-common/react/components/suspense"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"
import LoadingSpinner from "tws-common/ui/LoadingSpinner"

const queryClient = new QueryClient()

GlobalIdManager.disable()

type IProps = {
	$isFallbackActive: boolean
}

const SuspendParent = styled.div.attrs<IProps>(props => ({
	style: {
		display: props.$isFallbackActive ? "none" : "block",
	},
}))<IProps>``

const Layout = (props: {
	children: ReactElement | ReactNode | ReactFragment | null | undefined
}) => {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<AppNavbar />
				<SimpleSuspenseDisplay
					fallback={() => <LoadingSpinner />}
					display={({ isFallbackActive, children }) => (
						<SuspendParent $isFallbackActive={isFallbackActive}>
							{children}
						</SuspendParent>
					)}
				>
					<DialogBoundary>{props.children}</DialogBoundary>
				</SimpleSuspenseDisplay>
			</QueryClientProvider>
		</>
	)
}

export default Layout

*/
