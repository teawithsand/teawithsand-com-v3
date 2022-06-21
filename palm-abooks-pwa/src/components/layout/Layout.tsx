import React, { useEffect, useMemo } from "react"
import { Provider } from "react-redux"

import Navbar from "@app/components/layout/Navbar"
import { MBFRMetadataLoaderAdapter } from "@app/domain/bfr/metadataLoader"
import { MPlayerSourceResolver } from "@app/domain/bfr/source"
import { createStore } from "@app/domain/redux/store"

import { BFRMetadataLoader } from "tws-common/player/bfr/metadataLoader"
import { BFRPlayer } from "tws-common/player/bfr/player"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"

const queryClient = new QueryClient()

const Layout = (props: any) => {
	const { children } = props || {}

	const store = useMemo(() => createStore(), [])

	useEffect(() => {
		const player = new BFRPlayer(
			new Audio(),
			store,
			MPlayerSourceResolver.getInstance(),
			state => state.bfrState,
		)

		return () => {
			player.release()
		}
	}, [])

	useEffect(() => {
		const loader = new BFRMetadataLoader(
			store,
			state => state.bfrState,
			new MBFRMetadataLoaderAdapter(MPlayerSourceResolver.getInstance()),
		)

		return () => {
			loader.release()
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
