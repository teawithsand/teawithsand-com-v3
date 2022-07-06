import { ImageDataLike } from "gatsby-plugin-image"
import React, { useRef } from "react"
import styled from "styled-components"

import ShrineViewArticleSection from "@app/components/shrine/view/ShrineViewArticleSection"
import ShrineViewCommentsSection from "@app/components/shrine/view/ShrineViewCommentsSection"
import { ShrineViewContext } from "@app/components/shrine/view/ShrineViewContext"
import ShrineViewGallerySection from "@app/components/shrine/view/ShrineViewGallerySection"
import ShrineViewMapSection from "@app/components/shrine/view/ShrineViewMapSection"

import {
	BREAKPOINT_LG,
	BREAKPOINT_MD,
	breakpointIndex,
	useBreakpointIndex,
} from "tws-common/react/hook/dimensions/useBreakpoint"

export type ShrineViewData = {
	title: string
	path: string
	excerpt: string
	createdAt: string
	lastEditedAt: string | null
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
	const {
		html,
		title,
		tags,
		images,
		coordinates,
		createdAt,
		lastEditedAt,
		featuredImage,
	} = data

	const gallerySectionRef = useRef<HTMLElement | null>(null)
	const mapSectionRef = useRef<HTMLElement | null>(null)
	const commentsSectionRef = useRef<HTMLElement | null>(null)

	const isSmall =
		useBreakpointIndex(breakpointIndex(BREAKPOINT_LG)) <
		breakpointIndex(BREAKPOINT_MD)

	return (
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
					lastEditedAt={lastEditedAt ? new Date(lastEditedAt) : null}
				/>

				<ShrineViewGallerySection
					images={images}
					ref={gallerySectionRef}
				/>

				<ShrineViewMapSection
					coordinates={coordinates}
					ref={mapSectionRef}
				/>

				<ShrineViewCommentsSection ref={commentsSectionRef} />
			</ParentContainer>
		</ShrineViewContext.Provider>
	)
}

export default ShrineView
