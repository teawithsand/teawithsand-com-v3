import * as fs from "fs"
import {
	customizeDefaultPlugins,
	GatsbyTransformerRemarkPlugins,
	makeConfig,
	makeLayoutPlugin,
	makeManifestPlugin,
	SelfPlugins,
} from "tws-gatsby-plugin"

const plugins = customizeDefaultPlugins(
	[
		makeManifestPlugin("./src/images/icon.png"),
		makeLayoutPlugin("./src/Layout.jsx"),
	],
	SelfPlugins,
	GatsbyTransformerRemarkPlugins,
	[
		// for some reason
		// when this plugin is included here it works
		// and when it's included below sources it causes compilation to fail...
		{
			resolve: `gatsby-plugin-disqus`,
			options: {
				shortname: `teawithsand-com`,
			},
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "blog",
				path: "./content/blog",
			},
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "images",
				path: "./src/images/",
			},
			__key: "images",
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "pages",
				path: "./src/pages/",
			},
			__key: "pages",
		},

		{
			resolve: "gatsby-plugin-feed",
			options: {
				query: `
					query FeedMetadata {
						site {
							siteMetadata {
								title
								siteUrl
							}
						}
					}
				`,
				feeds: [
					{
						serialize: ({ query: { site, allFile } }) => {
							return allFile.nodes
								.map(v => v.childMarkdownRemark)
								.filter(v => !!v)
								.map(node => {
									return Object.assign(
										{},
										{
											title: node.frontmatter.title,
											description: node.excerpt,
											date: node.frontmatter.createdAt,
											site_url: site.siteUrl,
											url:
												site.siteMetadata.siteUrl +
												node.fields.path,
											guid: node.frontmatter.uuid,
											language: node.frontmatter.language,
											custom_elements: [
												{
													"content:encoded":
														node.html,
												},
											],
										},
									)
								})
						},
						// fragments are not allowed here
						query: `
							query BlogFeed {
								allFile(
									filter: {
										sourceInstanceName: { eq: "blog" }
										name: { eq: "index" }
										extension: { eq: "md" }
									}
								) {
									nodes {
										childMarkdownRemark {
											fields {
												path
											}
											frontmatter {
												slug
												title
												language
												createdAt
												lastEditedAt
												tags
											}
											excerpt(pruneLength: 240)
											timeToRead
											html
										}
									}
								}
							}
						`,
						output: "/rss.xml",
						title: "Teawithsand's blog main RSS feed",
						// optional configuration to insert feed reference in pages:
						// if `string` is used, it will be used to create RegExp and then test if pathname of
						// current page satisfied this regular expression;
						// if not provided or `undefined`, all pages will have feed reference inserted
						// match: "^/blog/",
						// optional configuration to specify external rss feed, such as feedburner
						// link: "https://feeds.feedburner.com/gatsby/blog",
					},
				],
			},
		},
	],
)
const config = makeConfig(
	{
		siteUrl: "https://teawithsand.com/",
	},
	plugins,
)

export default config
