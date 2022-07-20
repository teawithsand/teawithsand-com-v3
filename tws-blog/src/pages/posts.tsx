import PostsGrid from "@app/components/post/PostsGrid"
import { PostHeader } from "@app/domain/Post"
import { graphql } from "gatsby"
import * as React from "react"
import { Container } from "tws-common/ui"

const IndexPage = (props: { data: Queries.PostListQuery }) => {
	const nodes = props.data.allFile.nodes.map(v => v.childMarkdownRemark)
	const headers: PostHeader[] = []

	for (const n of nodes) {
		if (!n || !n.frontmatter || !n.fields) continue

		headers.push({
			createdAt: n.frontmatter.createdAt || "",
			path: n.fields.path || "",
			timeToRead: n.timeToRead || 0,
			tags: (n.frontmatter.tags || []).map(v => v || ""),
			title: n.frontmatter.title || "",
			slug: n.frontmatter.slug || "",
			featuredImage: n.frontmatter.featuredImage?.childImageSharp,
		})
	}

	return (
		<main>
			<Container className="mt-5">
				<h1
					style={{
						marginBottom: "1rem",
					}}
				>
					Post list ({headers.length})
				</h1>
				<PostsGrid posts={headers} />
			</Container>
		</main>
	)
}

export default IndexPage

export const query = graphql`
	query PostList {
		allFile(
			filter: {
				sourceInstanceName: { eq: "blog" }
				name: { eq: "index" }
				extension: { eq: "md" }
			}
		) {
			nodes {
				childMarkdownRemark {
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
					timeToRead
				}
			}
		}
	}
`
