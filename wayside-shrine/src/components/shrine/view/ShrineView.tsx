import { IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image"
import React, { useRef } from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"

import ShrineViewArticleSection from "@app/components/shrine/view/ShrineViewArticleSection"
import ShrineViewCommentsSection from "@app/components/shrine/view/ShrineViewCommentsSection"
import { ShrineViewContext } from "@app/components/shrine/view/ShrineViewContext"
import ShrineViewGallerySection from "@app/components/shrine/view/ShrineViewGallerySection"
import ShrineViewMapSection from "@app/components/shrine/view/ShrineViewMapSection"
import { Shrine, ShrineHeader } from "@app/domain/shrine"

import {
	BREAKPOINT_LG,
	BREAKPOINT_MD,
	breakpointIndex,
	useBreakpointIndex,
} from "tws-common/react/hook/dimensions/useBreakpoint"

const ParentContainer = styled.article`
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: minmax(0, auto);
	gap: 1rem;
`

const ShrineHelmet = (props: { header: ShrineHeader }) => {
	const { header } = props

	return (
		<Helmet>
			<title>{header.title}</title>
			<meta name="description" content={header.excerpt} />
			<meta name="og:title" content={header.title} />
			<meta name="og:description" content={header.excerpt} />
			<meta name="og:type" content="article" />
		</Helmet>
	)
}

const ShrineView = (props: { data: Shrine }) => {
	const { data } = props
	const { title, tags, coordinates, createdAt, lastEditedAt, featuredImage } =
		data.header
	const { galleryImages, html } = data

	const gallerySectionRef = useRef<HTMLElement | null>(null)
	const mapSectionRef = useRef<HTMLElement | null>(null)
	const commentsSectionRef = useRef<HTMLElement | null>(null)

	const isSmall =
		useBreakpointIndex(breakpointIndex(BREAKPOINT_LG)) <
		breakpointIndex(BREAKPOINT_MD)

	return (
		<>
			<ShrineHelmet header={data.header} />
			<ShrineViewContext.Provider value={{ isSmall }}>
				<ParentContainer>
					<ShrineViewArticleSection
						heroImage={featuredImage ?? null}
						imagesScrollElement={gallerySectionRef}
						mapScrollElement={mapSectionRef}
						commentsScrollElement={commentsSectionRef}
						tags={tags}
						title={title}
						contentHTML={html}
						createdAt={new Date(createdAt)}
						lastEditedAt={
							lastEditedAt ? new Date(lastEditedAt) : null
						}
					/>

					<ShrineViewGallerySection
						images={galleryImages}
						ref={gallerySectionRef}
					/>

					<ShrineViewMapSection
						coordinates={coordinates}
						ref={mapSectionRef}
					/>

					<ShrineViewCommentsSection ref={commentsSectionRef} />
				</ParentContainer>
			</ShrineViewContext.Provider>
		</>
	)
}

export default ShrineView
