import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import TeaAnimation from "@app/components/tea-animation/TeaAnimation"
import LoadingSpinner from "@app/components/loading-spinner/LoadingSpinner"

const BlogIndex = (props: any) => {
	return <LoadingSpinner />
}

export default BlogIndex

export const pageQuery = graphql`
	query {
		site {
			siteMetadata {
				title
			}
		}
		allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
			nodes {
				excerpt
				fields {
					slug
				}
				frontmatter {
					date(formatString: "MMMM DD, YYYY")
					title
					description
				}
			}
		}
	}
`
