import React from "react";



import Layout from "@app/components/layout/Layout";
import HTMLSimplePlayer from "@app/components/player/simple/HTMLSimplePlayer";


// const Gallery = loadable(() => import("@app/components/gallery/Gallery"))

const PlayerPage = () => {
	const element = new Audio()
	const player = new HTMLSimplePlayer(element)
	player.setIsPlayingWhenReady(false)
	player.setSource("https://samplelib.com/lib/preview/mp3/sample-3s.mp3")

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
					player.seek(0)
                    player.setIsPlayingWhenReady(true)
				}}
			>
				Click me to seek to the start
			</button>
		</Layout>
	)
}

export default PlayerPage