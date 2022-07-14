import { StaticImage } from "gatsby-plugin-image"
import React, { useMemo } from "react"

import PageContainer from "@app/components/layout/PageContainer"
import { AutonomousGallery } from "@app/gallery"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const Page = () => {
	const entries = [
		<StaticImage
			key={0}
			alt=""
			src="https://upload.wikimedia.org/wikipedia/commons/0/02/Wikipe-tan_in_Different_Anime_Styles.png"
			objectFit="contain"
		/>,
		<StaticImage
			key={1}
			alt=""
			src="https://placekitten.com/200/300"
			objectFit="contain"
		/>,
		<StaticImage
			key={2}
			alt=""
			src="https://placekitten.com/1000/100"
			objectFit="contain"
		/>,
		<StaticImage
			key={3}
			alt=""
			src="https://placekitten.com/100/1000"
			objectFit="contain"
		/>,
		<StaticImage
			key={4}
			alt=""
			src="https://placekitten.com/100/100"
			objectFit="contain"
		/>,
		<StaticImage
			key={5}
			alt=""
			src="https://placekitten.com/1000/1000"
			objectFit="contain"
		/>,
	]

	const memoed = useMemo(
		() =>
			entries.map(v => ({
				mainDisplay: v,
			})),
		[],
	)

	return (
		<PageContainer>
			<AutonomousGallery entries={memoed} />
		</PageContainer>
	)
}

export default wrapNoSSR(Page)
