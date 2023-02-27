import React from "react"
import styled from "styled-components"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import SmallTagList from "@app/components/tag/SmallTagList"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"
import { PostHeader } from "@app/domain/Post"

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

const PostEntryInfoRow = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: auto;
	grid-auto-rows: auto;

	text-align: center;
	justify-items: center;
`

const PostEntryTitleLink = styled(Link)`
	text-decoration: none;
	color: inherit;

	&:hover {
		color: inherit;
	}
`

const PostEntryTags = styled(SmallTagList)`
	justify-content: center;
`

const PostGridEntry = (props: { header: PostHeader }) => {
	const formatDate = useAppTranslationSelector(s => s.common.formatDate)
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
				{post.excerpt} <Link to={post.path}>Read more</Link>
			</p>
			<PostEntryInfoRow>
				<span>
					<time>{formatDate(post.createdAt)}</time>
				</span>
				<span>{post.timeToRead} min read</span>
			</PostEntryInfoRow>
			<PostEntryTags tags={post.tags} />
		</PostEntryContainer>
	)
}

export default PostGridEntry
