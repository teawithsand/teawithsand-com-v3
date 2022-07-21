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
import SmallTagList from "@app/components/tag/SmallTagList"
import PostGridEntry from "@app/components/post/PostGridEntry"

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

const PostsGrid = (props: { posts: PostHeader[] }) => {
	const posts = props.posts
	return (
		<GridParent>
			{posts.map((v, i) => (
				<PostGridEntry key={i} header={v} />
			))}
		</GridParent>
	)
}

export default PostsGrid
