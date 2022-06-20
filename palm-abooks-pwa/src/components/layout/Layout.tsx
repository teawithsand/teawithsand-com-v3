import React, { useEffect, useMemo } from "react"
import { Provider } from "react-redux"

import Navbar from "@app/components/layout/Navbar"
import { MPlayerSourceResolver } from "@app/domain/bfr/source"
import { createStore } from "@app/domain/redux/store"

import { BFRPlayer } from "tws-common/player/bfr/player"
import DefaultMetadataLoader from "tws-common/player/metadata/loader/DefaultMetadataLoader"
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

/*
	useEffect(() => {
		let called = false
		const clean = store.subscribe(() => {
			if (called) return
			const state = store.getState()

			const loader = new DefaultMetadataLoader(
				MPlayerSourceResolver.getInstance(),
			)

			const sources =
				state.bfrState.playerConfig.playlist.data?.sources ?? []
			const source = sources.length > 0 ? sources[0] : null
			console.error("GOT SOURCE", source)
			if (source) {
				called = true
				loader
					.loadMetadata(source)
					.then(console.error)
					.catch(console.error)
			}
		})
		return () => clean()
	}, [])

	*/
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
