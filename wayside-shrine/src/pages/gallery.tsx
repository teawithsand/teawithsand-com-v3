import Gallery from "@app/components/gallery/Gallery"
import PageContainer from "@app/components/layout/PageContainer"
import { StaticImage } from "gatsby-plugin-image"
import React, { useState } from "react"

const GalleryPage = () => {
	const [i, setI] = useState(0)
	return (
		<PageContainer>
			<main>
				<Gallery
					currentItemIndex={i}
					onNavigateToElement={i => setI(i)}
					onNavigateToNextElement={() => setI((i + 1) % 2)}
					onNavigateToPrevElement={() =>
						setI((i - 1 >= 0 ? i - 1 : 1) % 2)
					}
					size="large"
					mode="normal"
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
