import Navbar from "@app/components/layout/Navbar"
import { createStore } from "@app/domain/redux/store"
import React, { useEffect, useMemo } from "react"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"
import { BFRPlayer } from "tws-common/player/bfr/player"

const queryClient = new QueryClient()

const Layout = (props: any) => {
	const { children } = props || {}

	const store = useMemo(() => createStore(), [])

	useEffect(() => {
		const player = new BFRPlayer(
			new Audio(),
			store,
			state => state.bfrState,
		)

		return () => {
			player.release()
		}
	}, [])

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
