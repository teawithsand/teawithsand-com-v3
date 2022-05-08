import * as React from "react"
import { graphql } from "gatsby"

import Layout from "@app/components/layout/Layout"
import BlogPost from "@app/components/blog/post/BlogPost"

const BlogPostTemplate = ({ data }) => {
	return (
		<Layout withNoMain={true}>
			<code>
				<pre>{JSON.stringify(data, null, "\t")}</pre>
			</code>
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
				fields {
					path
				}
				frontmatter {
					title
				}
				excerpt(pruneLength: 160)
			}
		}
	}
`
