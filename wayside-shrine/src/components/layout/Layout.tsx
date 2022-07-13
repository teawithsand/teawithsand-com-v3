import React, { ReactElement, ReactFragment, ReactNode } from "react"

import AppNavbar from "@app/components/layout/Navbar"

import { GlobalIdManager } from "tws-common/misc/GlobalIDManager"
import { DialogBoundary } from "tws-common/react/components/dialog"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"
import { SSRProvider } from "tws-common/ui"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
			useErrorBoundary: true,
		},
		mutations: {
			useErrorBoundary: true,
		},
	},
})

GlobalIdManager.disable()

const Layout = (props: {
	children: ReactElement | ReactNode | ReactFragment | null | undefined
}) => {
	// Looks like top level element has to be the only one
	// otherwise gatsby SSR_DEV complaints about it
	//
	// Also looks like same goes for QueryClientProvider
	// Also(whats for the best I guess) production build of gatsby
	// doesn't seem to care about it at all.
	return (
		<SSRProvider>
			<QueryClientProvider client={queryClient}>
				<AppNavbar />
				<DialogBoundary>{props.children}</DialogBoundary>
			</QueryClientProvider>
		</SSRProvider>
	)
}

export default Layout
