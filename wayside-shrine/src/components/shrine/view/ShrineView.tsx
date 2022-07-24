import { graphql } from "gatsby"
import { IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image"
import React, { useRef } from "react"
import { Helmet } from "react-helmet"
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

	featuredImage?: ImageDataLike | IGatsbyImageData | null | undefined
	images: ImageDataLike[]
}

const ParentContainer = styled.article`
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: minmax(0, auto);
	gap: 1rem;
`

const ShrineHelmet = (props: { data: Readonly<ShrineViewData> }) => {
	const { data } = props

	return (
		<Helmet>
			<title>{data.title}</title>
			<meta name="description" content={data.excerpt} />
			<meta name="og:title" content={data.title} />
			<meta name="og:description" content={data.excerpt} />
			<meta name="og:type" content="article" />
		</Helmet>
	)
}

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
		<>
			<ShrineHelmet data={data} />
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
		</>
	)
}

export default ShrineView

export const query = graphql`
	fragment ShrineHeader on MarkdownRemark {
		id
		frontmatter {
			title
			createdAt
			coordinates
			tags
			featuredImage {
				childImageSharp {
					gatsbyImageData(
						layout: CONSTRAINED
						width: 420
						placeholder: BLURRED
					)
				}
			}
		}
		fields {
			path
		}
		excerpt(pruneLength: 240)
	}
`
