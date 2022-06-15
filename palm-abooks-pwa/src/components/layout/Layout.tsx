import Navbar from "@app/components/layout/Navbar"
import { store } from "@app/domain/redux/store"
import React from "react"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"

const queryClient = new QueryClient()

const Layout = (props: any) => {
	const { children } = props || {}

	console.log("Redux", store, store.getState())

	return (
		<>
			<Provider store={store}>
				<Navbar />
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</Provider>
		</>
	)
}

export default Layout
