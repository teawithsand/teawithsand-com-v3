import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image"
import React, { useContext } from "react"
import styled, { css } from "styled-components"

import { ShrineViewContext } from "@app/components/shrine/view/ShrineViewContext"

type ViewProps = {
	$isSmall: boolean
}

const ArticleContainer = styled.div<ViewProps>``

const ArticleTextContainer = styled.div``

const HeroImageParent = styled.div<ViewProps>`
	display: grid;
	max-height: 80vh;
	overflow: hidden;
	border-radius: 15px;

	${({ $isSmall }) =>
		$isSmall
			? css`
					max-width: 100%;
					margin-left: auto;
					margin-right: auto;
			  `
			: css`
					max-width: 40%;
					float: left;

					margin-right: 0.5rem;
					margin-bottom: 0.1rem;
			  `}
`

const HeroImage = styled(GatsbyImage)`
	grid-row: 1;
	grid-column: 1;
	z-index: 1;

	// Required, since otherwise image gets truncated
	//  rather than having it's max-height applied
	max-height: inherit;
`

const HeroImageBackground = styled(GatsbyImage)`
	grid-row: 1;
	grid-column: 1;
	filter: opacity(75%) blur(10px);
`

const Clearfix = styled.span`
	&::after {
		content: "";
		clear: both;
		display: table;
	}
`

// eslint-disable-next-line react/display-name
const ShrineViewArticleDisplay = React.forwardRef(
	(props: { html: string; heroImage: ImageDataLike | null }, ref) => {
		const { html, heroImage } = props

		const image = (heroImage && getImage(heroImage)) || null

		const { isSmall } = useContext(ShrineViewContext)

		return (
			<ArticleContainer $isSmall={isSmall}>
				{image && (
					<HeroImageParent $isSmall={isSmall}>
						<HeroImage
							image={image}
							alt="Hero image"
							objectFit="contain"
						/>
						<HeroImageBackground image={image} alt="Hero image" />
					</HeroImageParent>
				)}
				<ArticleTextContainer
					ref={ref as any}
					dangerouslySetInnerHTML={{
						__html: html,
					}}
				></ArticleTextContainer>

				<Clearfix></Clearfix>
			</ArticleContainer>
		)
	},
)

export default ShrineViewArticleDisplay
