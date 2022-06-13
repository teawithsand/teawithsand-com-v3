import Navbar from "@app/components/layout/Navbar"
import React from "react"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"

const queryClient = new QueryClient()

const Layout = (props: any) => {
	const { children } = props
	return (
		<>
			<Navbar />
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</>
	)
}

export default Layout
