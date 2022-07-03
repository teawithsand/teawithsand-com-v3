import AutonomousGallery from "@app/components/gallery/AutonomousGallery"
import PageContainer from "@app/components/layout/PageContainer"
import { StaticImage } from "gatsby-plugin-image"
import React from "react"

const GalleryPage = () => {
	const initEntries = [
		{
			mainDisplay: (
				<StaticImage
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Wikipe-tan_in_Different_Anime_Styles.png/1024px-Wikipe-tan_in_Different_Anime_Styles.png"
					alt="Some anime stuff"
					placeholder="blurred"
					layout="constrained"
					objectFit="contain"
				/>
			),
		},
		{
			mainDisplay: (
				<StaticImage
					src="https://placekitten.com/3000/3000"
					alt="A kitten"
					layout="constrained"
					objectFit="contain"
				/>
			),
		},
		{
			mainDisplay: (
				<StaticImage
					src="https://i.chzbgr.com/full/9228308480/h8A467A63/boy-both-boy-souid-h-18-yearsold-anime-pet-historycom-a-blood-cell-boy-human-teacher-14-years-old"
					alt="A kitten"
					layout="constrained"
					objectFit="contain"
				/>
			),
		},
	]

	const entries = new Array(20).fill(initEntries).flatMap(v => v)
	return (
		<PageContainer>
			<main>
				<AutonomousGallery entries={entries} />
			</main>
		</PageContainer>
	)
}

export default GalleryPage
