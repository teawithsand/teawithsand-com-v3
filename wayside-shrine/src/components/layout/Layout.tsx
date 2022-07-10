import React from "react"
import { ReactElement, ReactFragment, ReactNode } from "react"

import AppNavbar from "@app/components/layout/Navbar"

import { GlobalIdManager } from "tws-common/misc/GlobalIDManager"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"
import {
	DefaultDialogContext,
	useProvideDialogManager,
} from "tws-common/ui/dialog"

const queryClient = new QueryClient()

GlobalIdManager.disable()

const Layout = (props: {
	children: ReactElement | ReactNode | ReactFragment | null | undefined
}) => {
	const [dialogManager, render] = useProvideDialogManager()

	return (
		<>
			<DefaultDialogContext.Provider value={dialogManager}>
				<AppNavbar />
				<QueryClientProvider client={queryClient}>
					{render ? render() : null}
					{props.children}
				</QueryClientProvider>
			</DefaultDialogContext.Provider>
		</>
	)
}

export default Layout
