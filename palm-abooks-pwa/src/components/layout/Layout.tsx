import React, { useEffect, useMemo } from "react"
import { Provider } from "react-redux"

import Navbar from "@app/components/layout/Navbar"
import { MBFRMetadataLoaderAdapter } from "@app/domain/bfr/metadataLoader"
import { MPlaylistMetadata } from "@app/domain/bfr/playlist"
import { MPlayerSource, MPlayerSourceResolver } from "@app/domain/bfr/source"
import { createStore } from "@app/domain/redux/store"

import { setIsPlayingWhenReady } from "tws-common/player/bfr/actions"
import { BFRMediaSession } from "tws-common/player/bfr/mediaSession"
import { BFRMetadataLoader } from "tws-common/player/bfr/metadataLoader"
import { BFRPlayer } from "tws-common/player/bfr/player"
import { BFRPlaylist } from "tws-common/player/bfr/state"
import { QueryClient, QueryClientProvider } from "tws-common/react/hook/query"
import { MediaSessionEventType } from "tws-common/webapi/mediaSession/MediaSessionHelper"

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

	useEffect(() => {
		const mediaSession = new BFRMediaSession(
			store,
			state => state.bfrState,
			{
				handleMediaSessionEvent: e => {
					if (e.type === MediaSessionEventType.PAUSE) {
						store.dispatch(setIsPlayingWhenReady(false))
					} else if (e.type === MediaSessionEventType.PLAY) {
						store.dispatch(setIsPlayingWhenReady(true))
					} else {
						// NIY implement this
					}
				},
				selectMetadata: (
					playlist: BFRPlaylist<MPlaylistMetadata, MPlayerSource>,
					i,
				) => ({
					title: "PalmABooks PWA playing",
					album: "No album",
					artist: "teawithsand :3",
					artwork: [],
				}),
				selectPlayerState: state => {
					if (state.bfrState.playerConfig.isPlayingWhenReady) {
						return "playing"
					} else {
						return "paused"
					}
				},
				selectPositionState: state => {
					return {
						duration: state.bfrState.playerState.duration,
						playbackRate: state.bfrState.playerConfig.speed,
						position: state.bfrState.playerState.position ?? 0,
					}
				},
			},
		)

		return () => {
			mediaSession.release()
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
