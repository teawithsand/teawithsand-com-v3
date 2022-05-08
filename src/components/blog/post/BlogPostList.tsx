import BlogPostListDisplay from "@app/components/blog/post/BlogPostListDisplay"
import { graphql, useStaticQuery } from "gatsby"
import React from "react"

export default () => {
	const data = useStaticQuery(graphql`
		query {
			allMarkdownRemark(
				filter: { fields: { sourceName: { eq: "blog" } } }
				sort: { fields: [frontmatter___date], order: ASC }
			) {
				nodes {
					id
					fields {
						slug
						path
					}
					frontmatter {
						title
						date(formatString: "YYYY-MM-DD")
						tags
					}
					excerpt(pruneLength: 160)
				}
			}
		}
	`)

	const entries = data.allMarkdownRemark.nodes
	return (
		<BlogPostListDisplay
			title={"All posts"}
			entries={entries}
		/>
	)
}
