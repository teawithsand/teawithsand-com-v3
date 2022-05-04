import React from "react"
import { graphql } from "gatsby"

import Layout from "@app/components/layout/Layout"
import Home from "@app/components/pages/home/home"

const Index = () => {
	return (
		<Layout>
			<Home />
		</Layout>
	)
}

export default Index

export const pageQuery = graphql`
	query {
		site {
			siteMetadata {
				title
			}
		}
	}
`
