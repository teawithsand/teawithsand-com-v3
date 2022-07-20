import React, { useMemo } from "react"
import { PostHeader } from "@app/domain/Post"
import styled from "styled-components"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import {
	BREAKPOINT_MD,
	breakpointMediaDown,
	BREAKPOINT_SM,
} from "tws-common/react/hook/dimensions/useBreakpoint"
import { tagPath } from "@app/paths"

const leftRightPadding = "0.3rem"

const GridParent = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-auto-rows: 1fr;

	@media ${breakpointMediaDown(BREAKPOINT_MD)} {
		grid-template-columns: repeat(2, 1fr);
	}

	@media ${breakpointMediaDown(BREAKPOINT_SM)} {
		grid-template-columns: repeat(1, 1fr);
	}

	justify-items: stretch;
	align-items: center;

	min-width: 0px;
	gap: 2rem;
	box-sizing: border-box;
`

const PostEntryContainer = styled.article`
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
`

const PostEntryImageLink = styled(Link)`
	display: block;
	width: 100%;
	height: 100%;

	& > * {
		width: 100%;
		height: 100%;
	}
`

const PostEntryImage = styled(GatsbyImage)`
	display: block;

	width: 100%;
	height: 100%;
	max-height: 50vh;

	// default in case it was not set on image directly
	object-fit: cover;
`

const PostEntryTitle = styled.h1`
	padding-left: ${leftRightPadding};
	padding-right: ${leftRightPadding};
	font-size: 2rem;
	margin: 0;
	padding: 0;

	text-align: center;
`

const PostEntryInfoRow = styled.div`
	padding-left: ${leftRightPadding};
	padding-right: ${leftRightPadding};

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

const PostEntryTags = styled.div`
	display: flex;
	flex-flow: row wrap;
	row-gap: 0.4rem;
	column-gap: 0.8rem;

	justify-content: center;

	padding-left: ${leftRightPadding};
	padding-right: ${leftRightPadding};
`

const PostEntry = (props: { header: PostHeader }) => {
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
			<PostEntryTitleLink to={post.path}>
				<PostEntryTitle>{post.title}</PostEntryTitle>
			</PostEntryTitleLink>
			<PostEntryInfoRow>
				<span>
					<time>{formatDate(post.createdAt)}</time>
				</span>
				<span>{post.timeToRead} minutes read</span>
			</PostEntryInfoRow>
			<PostEntryTags>
				{post.tags.map((v, i) => (
					<Link className="link-secondary" to={tagPath(v)} key={i}>
						#{v}
					</Link>
				))}
			</PostEntryTags>
		</PostEntryContainer>
	)
}

const PostsGrid = (props: { posts: PostHeader[] }) => {
	const posts = props.posts
	return (
		<GridParent>
			{posts.map((v, i) => (
				<PostEntry key={i} header={v} />
			))}
		</GridParent>
	)
}

export default PostsGrid
