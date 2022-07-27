import React, { ReactElement, ReactFragment, ReactNode } from "react"

import Footer from "@app/components/layout/Footer"
import AppNavbar from "@app/components/layout/Navbar"

import { GlobalIdManager } from "tws-common/misc/GlobalIDManager"
import { DialogBoundary } from "tws-common/react/components/dialog"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"
import { ProvideFixedLanguage } from "tws-common/trans/language"
import { SSRProvider } from "tws-common/ui"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: 0,
			suspense: true,
			useErrorBoundary: true,
			retry: false,
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
		<SSRProvider>
			<QueryClientProvider client={queryClient}>
				<ProvideFixedLanguage language="pl-PL">
					<AppNavbar />
					<DialogBoundary>{props.children}</DialogBoundary>
					<Footer />
				</ProvideFixedLanguage>
			</QueryClientProvider>
		</SSRProvider>
	)
}

export default Layout
