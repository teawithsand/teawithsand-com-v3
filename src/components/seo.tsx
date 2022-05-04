import * as React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

type MetaProps =
	| {
			content: string
			name: string
	  }
	| {
			property: string
			content: string
	  }

const Seo = (props: {
	description?: string
	lang?: string
	meta?: MetaProps[]
	title?: string
}) => {
	const { site } = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
					}
				}
			}
		`
	)

	const { description, lang, meta, title } = props

	const metaDescription = description || site.siteMetadata.description
	const defaultTitle = site.siteMetadata?.title ?? ""

	return (
		<Helmet
			htmlAttributes={{
				lang,
			}}
			title={title || defaultTitle}
			meta={[
				{
					name: `description`,
					content: metaDescription,
				},
				{
					property: `og:title`,
					content: title,
				},
				{
					property: `og:description`,
					content: metaDescription,
				},
				{
					property: `og:type`,
					content: `website`,
				},
				/*
                {
					name: `twitter:card`,
					content: `summary`,
				},
				{
					name: `twitter:creator`,
					content: site.siteMetadata?.social?.twitter || ``,
				},
				{
					name: `twitter:title`,
					content: title,
				},
				{
					name: `twitter:description`,
					content: metaDescription,
				},
                */
			].concat(meta ?? [])}
		/>
	)
}

export default Seo
