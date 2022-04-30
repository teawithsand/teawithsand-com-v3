import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "@app/components/layout/Layout"

const NotFoundPage = (props: any) => {
	const siteTitle = props.data.site.siteMetadata.title

	return (
		<Layout>
			<h1>Not found page here</h1>
			<Link to={"/"}>Go home</Link>
		</Layout>
	)
}

export default NotFoundPage

export const pageQuery = graphql`
	query {
		site {
			siteMetadata {
				title
			}
		}
	}
`
