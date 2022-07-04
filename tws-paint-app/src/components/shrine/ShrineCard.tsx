import { Link } from "gatsby"
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image"
import React from "react"
import styled from "styled-components"
import { Button, Card } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

export type ShrineCardData = {
	title: string
	path: string
	excerpt: string
	createdDate: string
	lastEditedDate: string | null
	tags: string[]
	coordinates: [number, number]
	featuredImage?: ImageDataLike | undefined
}

const TopImage = styled(GatsbyImage)`
	max-height: 30vh;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const ShrineCard = (props: { data: Readonly<ShrineCardData> }) => {
	const { data } = props
	const { title, path, excerpt, featuredImage } = data

	const image = featuredImage ? getImage(featuredImage) : null
	return (
		<Card as="article">
			{image ? (
				<Link to={path}>
					<TopImage
						className="card-img-top"
						alt={title}
						image={image}
					/>
				</Link>
			) : null}
			<Card.Body>
				<Card.Title>{title}</Card.Title>
				<Card.Text>{excerpt}</Card.Text>
				<LinkContainer to={path}>
					<Button href="#">Zobacz</Button>
				</LinkContainer>
			</Card.Body>
		</Card>
	)
}

export default ShrineCard
