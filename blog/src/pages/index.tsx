import { graphql } from "gatsby"
import React from "react"
import { helloWorld } from "tws-common"

import Layout from "@app/components/layout/Layout"
import Home from "@app/components/pages/home/home"

const Index = () => {
	helloWorld()
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
