import Gallery from "@app/components/gallery/Gallery"
import PageContainer from "@app/components/layout/PageContainer"
import { StaticImage } from "gatsby-plugin-image"
import React from "react"

const GalleryPage = () => {
	return (
		<PageContainer>
			<main>
				<Gallery
					entries={[
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
					]}
				/>
			</main>
		</PageContainer>
	)
}

export default GalleryPage
