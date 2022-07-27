import React, { useRef } from "react"
import styled from "styled-components"

import ShrineViewArticleSection from "@app/components/shrine/view/ShrineViewArticleSection"
import ShrineViewCommentsSection from "@app/components/shrine/view/ShrineViewCommentsSection"
import { ShrineViewContext } from "@app/components/shrine/view/ShrineViewContext"
import ShrineViewGallerySection from "@app/components/shrine/view/ShrineViewGallerySection"
import ShrineViewMapSection from "@app/components/shrine/view/ShrineViewMapSection"
import { Shrine, ShrineHeaderExt } from "@app/domain/shrine"

import { absolutizePath } from "tws-common/lang/path"
import { makeSeoImage } from "tws-common/misc/social/image"
import { Seo } from "tws-common/react/components/Seo"
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

const ShrineHelmet = (props: { header: ShrineHeaderExt }) => {
	const { header } = props

	const image = header.featuredImageSocial
		? makeSeoImage(
				"https://szlakiemkapliczek.pl",
				header.featuredImageSocial,
		  )
		: null

	return (
		<Seo
			title={header.title}
			description={header.excerpt}
			language="pl-PL"
			// TODO(teawithsand): access this via config hook
			canonicalUrl={absolutizePath(
				"https://szlakiemkapliczek.pl",
				header.path,
			)}
			type="article"
			articleData={{}}
			image={
				image
					? {
							...image,
							alt: header.title,
					  }
					: undefined
			}
		/>
	)
}

export const ShrineViewPage = (props: { data: Shrine }) => {
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
