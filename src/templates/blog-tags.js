import * as React from "react"
import { graphql } from "gatsby"

import Layout from "@app/components/layout/Layout"
import NewBlogPostListWithTag from "@app/components/blog/newpostlist/NewBlogPostListWithTag"

const BlogPostTemplate = props => {
	const { data, pageContext } = props
	return (
		<Layout withNoMain={true}>
			<NewBlogPostListWithTag
				tag={pageContext.tag}
				entries={data.allMarkdownRemark.nodes}
			/>
		</Layout>
	)
}

export default BlogPostTemplate

export const pageQuery = graphql`
	query BlogPostWithTags($tag: String!) {
		allMarkdownRemark(
			filter: {
				fields: { sourceName: { eq: "blog" } }
				frontmatter: { tags: { in: [$tag] } }
			}
			sort: { order: DESC, fields: frontmatter___date }
		) {
			nodes {
				id
				fields {
					path
				}
				frontmatter {
					title
					date(formatString: "YYYY-MM-DD")
					tags

					featuredImage {
						childImageSharp {
							gatsbyImageData(
								layout: CONSTRAINED
								width: 200
								placeholder: BLURRED
								formats: [AUTO, WEBP, AVIF]
							)
						}
					}
				}
				excerpt(pruneLength: 160)
			}
		}
	}
`
