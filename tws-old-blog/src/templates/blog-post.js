import * as React from "react"
import { graphql } from "gatsby"

import BlogPost from "@app/components/blog/post/BlogPost"
import Layout from "@app/components/layout/Layout"

const BlogPostTemplate = ({ data }) => {
	return (
		<Layout withNoMain={true}>
			<BlogPost
				post={data.markdownRemark}
				prev={data.previous}
				next={data.next}
			/>
		</Layout>
	)
}

export default BlogPostTemplate

export const pageQuery = graphql`
	query BlogPostBySlug(
		$id: String!
		$previousPostId: String
		$nextPostId: String
	) {
		site {
			siteMetadata {
				title
			}
		}
		markdownRemark(id: { eq: $id }) {
			id
			excerpt(pruneLength: 160)
			html
			fields {
				slug
				path
			}
			frontmatter {
				title
				date(formatString: "MMMM DD, YYYY")
				description
				tags
			}
		}
		previous: markdownRemark(id: { eq: $previousPostId }) {
			fields {
				slug
				path
			}
			frontmatter {
				title
				tags
			}
		}
		next: markdownRemark(id: { eq: $nextPostId }) {
			fields {
				slug
				path
			}
			frontmatter {
				title
				tags
			}
		}
	}
`
