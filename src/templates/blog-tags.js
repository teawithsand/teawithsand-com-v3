import * as React from "react"
import { graphql } from "gatsby"

import Layout from "@app/components/layout/Layout"
import BlogPost from "@app/components/blog/post/BlogPost"
import BlogPostListWithTag from "@app/components/blog/post/BlogPostListWithTag"

const BlogPostTemplate = ({ data }) => {
	/*
	<code>
		<pre>{JSON.stringify(data, null, "\t")}</pre>
	</code>
	*/
	return (
		<Layout withNoMain={true}>
			<BlogPostListWithTag entries={data.allMarkdownRemark.nodes} />
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
					date(formatString: "YYYY-MM-DD")
					tags
				}
				excerpt(pruneLength: 160)
			}
		}
	}
`
