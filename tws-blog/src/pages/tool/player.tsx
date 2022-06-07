import React from "react"

import Layout from "@app/components/layout/Layout"

import AdvancedPlayerImpl from "tws-common/player/advanced/AdvancedPlayerImpl"
import HTMLSimplePlayer from "tws-common/player/simple/HTMLSimplePlayer"
import { URLPlayerSource } from "tws-common/player/source/PlayerSource"

// const Gallery = loadable(() => import("@app/components/gallery/Gallery"))

const PlayerPage = () => {
	const element = new Audio()
	const simplePlayer = new HTMLSimplePlayer(element)
	const player = new AdvancedPlayerImpl(simplePlayer)
	/*
	simplePlayer.eventBus.addSubscriber(s => console.log(s))
	simplePlayer.setIsPlayingWhenReady(false)
	simplePlayer.setSource("https://samplelib.com/lib/preview/mp3/sample-3s.mp3")
	*/

	player.setPlaylist(
		["/file.mp3?q=1", "/file.mp3?q=2", "/file.mp3?q=3"].map(
			v => new URLPlayerSource(v),
		),
	)

	return (
		<Layout>
			<button
				onClick={() => {
					player.setIsPlayingWhenReady(true)
				}}
			>
				Click me to play
			</button>
			<button
				onClick={() => {
					player.seek(0, 0)
					player.setIsPlayingWhenReady(true)
				}}
			>
				Click me to seek to the start
			</button>
		</Layout>
	)
}

export default PlayerPage
