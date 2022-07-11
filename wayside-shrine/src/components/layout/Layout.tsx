import React, { ReactElement, ReactFragment, ReactNode } from "react"

import AppNavbar from "@app/components/layout/Navbar"

import { GlobalIdManager } from "tws-common/misc/GlobalIDManager"
import { DialogBoundary } from "tws-common/react/components/dialog"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"

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
	return (
		<QueryClientProvider client={queryClient}>
			<AppNavbar />
			<DialogBoundary>{props.children}</DialogBoundary>
		</QueryClientProvider>
	)
}

export default Layout
