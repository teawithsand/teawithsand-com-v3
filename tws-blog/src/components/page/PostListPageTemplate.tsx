import PageContainer from "@app/components/layout/PageContainer"
import PostsGrid from "@app/components/post/PostsGrid"
import { PostHeader } from "@app/domain/Post"
import { graphql } from "gatsby"
import React, { ReactFragment, ReactNode } from "react"
import styled from "styled-components"

const ParentContainer = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: auto;
	grid-auto-rows: auto;
	gap: 1rem;
`

const PostListPageTemplate = (props: {
	heading?: ReactNode
	headers: PostHeader[]
}) => {
	const { headers, heading } = props
	return (
		<main>
			<PageContainer>
				<ParentContainer>
					{heading ? heading : null}
					<PostsGrid posts={headers} />
				</ParentContainer>
			</PageContainer>
		</main>
	)
}

export default PostListPageTemplate

export const convertPostHeader = (
	header: Queries.PostHeaderFragment,
): PostHeader => {
	if (!header || !header.frontmatter || !header.fields) {
		throw new Error("invalid header provided")
	}
	return {
		createdAt: header.frontmatter.createdAt || "",
		path: header.fields.path || "",
		timeToRead: header.timeToRead || 0,
		tags: (header.frontmatter.tags || []).map(v => v || ""),
		title: header.frontmatter.title || "",
		slug: header.frontmatter.slug || "",
		featuredImage:
			header.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData,
		excerpt: header.excerpt || "",
	}
}

export const query = graphql`
	fragment PostHeader on MarkdownRemark {
		fields {
			path
		}
		frontmatter {
			slug
			title
			language
			createdAt
			lastEditedAt
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
		excerpt(pruneLength: 240)
		timeToRead
	}
`
