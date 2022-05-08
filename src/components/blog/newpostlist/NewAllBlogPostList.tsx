import NewBlogPostList from "@app/components/blog/newpostlist/NewBlogPostList"
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
						featuredImage {
							childImageSharp {
								gatsbyImageData(
									layout: CONSTRAINED
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
	`)

	const entries = data.allMarkdownRemark.nodes
	return <NewBlogPostList title={"All posts"} entries={entries} />
}
