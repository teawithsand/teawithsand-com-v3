module.exports = {
	siteMetadata: {
		title: `TWS website & blog`,
		author: {
			name: `Teawithsand`,
			summary: `programmer, who sometimes makes something useful`,
		},
		description: `teawithsand's website with blog, portfolio and some utils`,
		siteUrl: `https://www.teawithsand.com/`,
	},
	plugins: [
		`gatsby-plugin-image`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/content/blog`,
				name: `blog`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
			},
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					{
						resolve: `gatsby-remark-images`,
						options: {
							srcSetBreakpoints: [
								1920 / 8,
								1920 / 4,
								1920 / 2,
								1920,
							],
							withWebp: {
								quality: 80,
							},
							withAvif: {
								quality: 80,
							},
							tracedSVG: true,
						},
					},
					{
						resolve: `gatsby-remark-responsive-iframe`,
						options: {
							wrapperStyle: `margin-bottom: 1.0725rem`,
						},
					},
					{
						resolve: `gatsby-remark-prismjs`,
						options: {
							showLineNumbers: true,
						},
					},
					`gatsby-remark-copy-linked-files`,
					`gatsby-remark-smartypants`,
				],
			},
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		// {
		//   resolve: `gatsby-plugin-google-analytics`,
		//   options: {
		//     trackingId: `ADD YOUR TRACKING ID HERE`,
		//   },
		// },
		{
			resolve: `gatsby-plugin-feed`,
			options: {
				query: `
					{
						site {
							siteMetadata {
								title
								description
								siteUrl
								site_url: siteUrl
							}
						}
					}
				`,
				feeds: [
					{
						serialize: ({ query: { site, allMarkdownRemark } }) => {
							return allMarkdownRemark.nodes.map(node => {
								return Object.assign({}, node.frontmatter, {
									description: node.excerpt,
									date: node.frontmatter.date,
									url:
										site.siteMetadata.siteUrl +
										node.fields.path,
									guid:
										site.siteMetadata.siteUrl +
										node.fields.path,
									custom_elements: [
										{ "content:encoded": node.html },
									],
								})
							})
						},
						query: `
							{
								allMarkdownRemark(
									filter: {
										fields: { sourceName: { eq: "blog" } }
									}
								) {
									nodes {
										fields {
											slug
											path
										}
										frontmatter {
											date
											title
										}
									}
								}
							}
						`,
						output: "/rss.xml",
						title: "teawithsand's blog RSS feed",
					},
				],
			},
		},
		"gatsby-plugin-sitemap",
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Teawithsand's website`,
				short_name: `teawithsand.com`,
				start_url: `/`,
				background_color: `#ffffff`,
				// This will impact how browsers show your PWA/website
				// https://css-tricks.com/meta-theme-color-and-trickery/
				// theme_color: `#663399`,
				display: `minimal-ui`,
				icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
			},
		},
		`gatsby-plugin-react-helmet`,
		{
			resolve: "gatsby-plugin-remove-generator",
			options: {
				removeVersionOnly: true, // this is what I wanted tbh
			},
		},
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// For now offline functionality is disabled for main app
		// {
		// 	resolve: `gatsby-plugin-offline`,
		// 	// precachePages: [],
		// 	options: {
		// 		appendScript: require.resolve(`./src/sw/sw.js`),
		// 		workboxConfig: {
		// 			cacheId: `gatsby-plugin-offline`,
		// 			maximumFileSizeToCacheInBytes: 1024 * 1024 * 7, // 7MB limit
		// 			skipWaiting: true,
		// 			clientsClaim: true,
		// 		},
		// 	},
		// },
		{
			resolve: `gatsby-plugin-sass`,
			options: {
				/*
				// Override the file regex for Sass
				sassRuleTest: /\.global\.s(a|c)ss$/,
				// Override the file regex for CSS modules
				sassRuleModulesTest: /\.module\.s?(a|c)ss$/,
				*/
				useResolveUrlLoader: true,
				cssLoaderOptions: {
					// camelCase: true,
					modules: {
						exportLocalsConvention: "camelCaseOnly",
					},
				},
				postCssPlugins: [require("postcss-preset-env")({ stage: 4 })],
			},
		},
		{
			resolve: `gatsby-plugin-typescript`,
			options: {
				isTSX: true, // defaults to false
				jsxPragma: `jsx`, // defaults to "React"
				allExtensions: true, // defaults to false
			},
		},
		// Note: brotli is not used for now
		// since nginx does not support it by default
		// and I am to lazy to compile plugin in dockerfile
		// so gzip must be enough
		{
			resolve: "gatsby-plugin-zopfli",
			options: {
				extensions: ["css", "html", "js", "svg", "txt", "json"],
				compression: {
					numiterations: 15,
					blocksplitting: true,
					blocksplittingmax: 15,
				},
			},
		},
		{
			resolve: `gatsby-plugin-disqus`,
			options: {
				shortname: `teawithsand-com`,
			},
		},
		// TODO(teawithsand): configure this plugin to prevent page switching
		// { resolve: "gatsby-plugin-layout" },
		{ resolve: "gatsby-plugin-styled-components" },
	],
}
