import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import React from "react"
import styled from "styled-components"

import { ShrineHeader } from "@app/domain/shrine"
import { tagPath } from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Button } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"
import { SmallTagLine } from "tws-common/ui/tag/SmallTagLine"

const PostEntryContainer = styled.article`
	height: 100%;

	display: grid;
	grid-auto-flow: row;
	grid-template-columns: 100%;

	grid-template-rows:
		1fr minmax(0, auto) minmax(0, auto)
		minmax(0, auto);

	justify-items: center;
	gap: 0.3rem;

	transition: transform 300ms, border-color 300ms, border-width 300ms,
		outline 300ms;

	border: 1px solid rgba(0, 0, 0, 0.125);
	border-radius: 0.25rem;
	min-width: 0;

	padding-bottom: 0.3rem;

	background-clip: border-box;
	overflow: hidden;

	&:hover {
		transform: translateY(-0.5rem);
		z-index: 1;
	}

	& > * {
		padding-left: 0.3rem;
		padding-right: 0.3rem;
	}
`

const PostEntryImageLink = styled(Link)`
	display: block;
	width: 100%;
	height: 100%;

	padding-left: 0;
	padding-right: 0;

	& > * {
		width: 100%;
		height: 100%;
	}
`

const PostEntryTitle = styled.h1`
	font-size: 2rem;
	margin: 0;
	padding-top: 0;
	padding-bottom: 0;

	text-align: center;
`

const InfoRow = styled.div`
	width: 100%;

	display: grid;
	grid-template-columns: minmax(0, auto);
	grid-template-rows: minmax(0, auto);
	align-items: stretch;

	padding-bottom: .3rem;
`

const SeeButton = styled(Button)``

const PostEntryTitleLink = styled(Link)`
	text-decoration: none;
	color: inherit;

	&:hover {
		color: inherit;
	}
`

const PostEntryTags = styled(SmallTagLine)`
	justify-content: center;
`

export const ShrineGridEntry = (props: { header: ShrineHeader }) => {
	const post = props.header

	const image = post.featuredImage ? getImage(post.featuredImage) : null

	const imageComponent = image ? (
		<GatsbyImage image={image} alt={post.title} objectFit="cover" />
	) : null

	return (
		<PostEntryContainer>
			<PostEntryImageLink to={post.path}>
				{imageComponent}
			</PostEntryImageLink>
			<PostEntryTitle>
				<PostEntryTitleLink to={post.path}>
					{post.title}
				</PostEntryTitleLink>
			</PostEntryTitle>
			<p
				style={{
					textAlign: "justify",
				}}
			>
				{post.excerpt}
			</p>
			<InfoRow>
				<LinkContainer to={post.path}>
					<SeeButton href="#">Zobacz</SeeButton>
				</LinkContainer>
			</InfoRow>
			<PostEntryTags
				tagPathPicker={tag => tagPath(tag)}
				tags={post.tags}
			/>
		</PostEntryContainer>
	)
}
