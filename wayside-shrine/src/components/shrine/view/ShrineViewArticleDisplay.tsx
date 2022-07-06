import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image"
import React, { useContext } from "react"
import styled, { css } from "styled-components"

import { ShrineViewContext } from "@app/components/shrine/view/ShrineViewContext"

type ViewProps = {
	$isSmall: boolean
}

const ArticleContainer = styled.div<ViewProps>`
	display: grid;
	${({ $isSmall }) =>
		$isSmall
			? css`
					grid-template-columns: 1fr;
					grid-template-rows: auto auto;
					grid-auto-flow: column;
					row-gap: 2rem;
			  `
			: css`
					grid-template-columns: 0.3fr 0.7fr;
					grid-template-rows: 1fr;
					grid-auto-flow: row;
					gap: 1rem;
			  `}
`

const ArticleTextContainer = styled.div``

const HeroImageParent = styled.div`
	display: grid;
	max-height: 80vh;
	overflow: hidden;
`

const HeroImage = styled(GatsbyImage)`
	grid-row: 1;
	grid-column: 1;
	z-index: 1;
`

const HeroImageBackground = styled(GatsbyImage)`
	grid-row: 1;
	grid-column: 1;
	filter: opacity(75%) blur(10px);
`

const ShrineViewArticleDisplay = (props: {
	html: string
	heroImage: ImageDataLike | null
}) => {
	const { html, heroImage } = props

	const image = (heroImage && getImage(heroImage)) || null

	const { isSmall } = useContext(ShrineViewContext)

	return (
		<ArticleContainer $isSmall={isSmall}>
			{image && (
				<HeroImageParent>
					<HeroImage
						image={image}
						alt="Hero image"
						objectFit="contain"
					/>
					<HeroImageBackground image={image} alt="Hero image" />
				</HeroImageParent>
			)}
			<ArticleTextContainer
				dangerouslySetInnerHTML={{
					__html: html,
				}}
			></ArticleTextContainer>
		</ArticleContainer>
	)
}

export default ShrineViewArticleDisplay
