import PageContainer from "@app/components/layout/PageContainer"
import PostsGrid from "@app/components/post/PostsGrid"
import { Post, PostHeader } from "@app/domain/Post"
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
		lastEditedAt: header.frontmatter.lastEditedAt || null,
		path: header.fields.path || "",
		timeToRead: header.timeToRead || 0,
		tags: (header.frontmatter.tags || []).map(v => v || ""),
		title: header.frontmatter.title || "",
		slug: header.frontmatter.slug || "",
		featuredImage:
			header.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData,
		excerpt: header.excerpt || "",
		language: header.frontmatter.language || "",
	}
}

export const convertPost = (post: Queries.PostFragment): Post => {
	if (!post || !post.frontmatter || !post.fields) {
		throw new Error("invalid header provided")
	}
	return {
		header: {
			createdAt: post.frontmatter.createdAt || "",
			lastEditedAt: post.frontmatter.lastEditedAt || null,
			path: post.fields.path || "",
			timeToRead: post.timeToRead || 0,
			tags: (post.frontmatter.tags || []).map(v => v || ""),
			title: post.frontmatter.title || "",
			slug: post.frontmatter.slug || "",
			featuredImage:
				post.frontmatter.featuredImage?.childImageSharp
					?.gatsbyImageData,
			excerpt: post.excerpt || "",
			language: post.frontmatter.language || "",
			featuredImageSocial:
				post.frontmatter.featuredImageSocial?.childImageSharp
					?.gatsbyImageData,
		},
		contentHTML: post.html || "",
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
						width: 600
						placeholder: BLURRED
						quality: 80
					)
				}
			}
		}
		excerpt(pruneLength: 240)
		timeToRead
	}

	fragment Post on MarkdownRemark {
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
						width: 1920
						placeholder: BLURRED
						quality: 80
					)
				}
			}
			featuredImageSocial: featuredImage {
				childImageSharp {
					gatsbyImageData(
						layout: CONSTRAINED
						width: 1200
						height: 630
						formats: [JPG]
						transformOptions: { cropFocus: ATTENTION, fit: COVER }
					)
				}
			}
		}
		excerpt(pruneLength: 240)
		html
		timeToRead
	}
`
