import React from "react"
import { ReactElement, ReactFragment, ReactNode } from "react"

import AppNavbar from "@app/components/layout/Navbar"

import { GlobalIdManager } from "tws-common/misc/GlobalIDManager"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"

const queryClient = new QueryClient()

GlobalIdManager.disable()

const Layout = (props: {
	children: ReactElement | ReactNode | ReactFragment | null | undefined
}) => {
	return (
		<>
			<AppNavbar />
			<QueryClientProvider client={queryClient}>
				{props.children}
			</QueryClientProvider>
		</>
	)
}

export default Layout
