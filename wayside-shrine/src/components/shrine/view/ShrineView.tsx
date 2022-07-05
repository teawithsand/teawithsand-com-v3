import { ImageDataLike } from "gatsby-plugin-image"
import React, { useRef } from "react"
import styled from "styled-components"

import Map from "@app/components/map/Map"
import ShrineViewArticleSection from "@app/components/shrine/view/ShrineViewArticleSection"
import ShrineViewCommentsSection from "@app/components/shrine/view/ShrineViewCommentsSection"
import ShrineViewGallerySection from "@app/components/shrine/view/ShrineViewGallerySection"
import ShrineViewMapSection from "@app/components/shrine/view/ShrineViewMapSection"

export type ShrineViewData = {
	title: string
	path: string
	excerpt: string
	createdDate: string
	lastEditedDate: string | null
	tags: string[]
	coordinates: [number, number]
	html: string

	featuredImage?: ImageDataLike | undefined
	images: ImageDataLike[]
}

const ParentContainer = styled.article`
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: minmax(0, auto);
	gap: 1rem;
`

const ShrineView = (props: { data: Readonly<ShrineViewData> }) => {
	const { data } = props
	const { html, title, tags, images, coordinates } = data

	const gallerySectionRef = useRef<HTMLElement | null>(null)
	const mapSectionRef = useRef<HTMLElement | null>(null)
	const commentsSectionRef = useRef<HTMLElement | null>(null)

	return (
		<ParentContainer>
			<ShrineViewArticleSection
				imagesScrollElement={gallerySectionRef}
				mapScrollElement={mapSectionRef}
				commentsScrollElement={commentsSectionRef}
				tags={tags}
				title={title}
				contentHTML={html}
			/>

			<ShrineViewGallerySection images={images} ref={gallerySectionRef} />

			<ShrineViewMapSection
				coordinates={coordinates}
				ref={mapSectionRef}
			/>

			<ShrineViewCommentsSection ref={commentsSectionRef} />
		</ParentContainer>
	)
}

export default ShrineView
