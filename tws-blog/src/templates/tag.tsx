import PostListPageTemplate, {
	convertPostHeader,
} from "@app/components/page/PostListPageTemplate"
import PostsGrid from "@app/components/post/PostsGrid"
import { PostHeader } from "@app/domain/Post"
import { graphql } from "gatsby"
import * as React from "react"
import { asNonNullable } from "tws-common/typing/required"
import { Container } from "tws-common/ui"

const TagTemplate = (props: {
	data: Queries.PostTagQuery
	pageContext: {
		count: number
		tag: string
	}
}) => {
	const { tag } = props.pageContext
	const headers = props.data.allFile.nodes
		.map(v => v.childMarkdownRemark)
		.map(v => asNonNullable(v))
		.map(v => convertPostHeader(v))

	return (
		<PostListPageTemplate
			heading={
				<header>
					<h1
						style={{
							marginBottom: "1rem",
						}}
					>
						Posts with tag <em>{tag}</em> ({headers.length})
					</h1>
				</header>
			}
			headers={headers}
		/>
	)
}

export default TagTemplate

export const query = graphql`
	query PostTag($tag: String!) {
		allFile(
			filter: {
				sourceInstanceName: { eq: "blog" }
				name: { eq: "index" }
				extension: { eq: "md" }
				childMarkdownRemark: { frontmatter: { tags: { in: [$tag] } } }
			}
			sort: {
				fields: [childMarkdownRemark___frontmatter___createdAt]
				order: DESC
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
					html
					excerpt(pruneLength: 160)
				}
			}
		}
	}
`
