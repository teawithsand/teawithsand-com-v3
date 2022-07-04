import type { GatsbyConfig } from "gatsby"
import * as path from "path"

const config: GatsbyConfig = {
	siteMetadata: {
		title: `wayside-shrine`,
		siteUrl: `https://szlakiemkapliczek.pl`,
	},
	// More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
	// If you use VSCode you can also use the GraphQL plugin
	// Learn more at: https://gatsby.dev/graphql-typegen
	graphqlTypegen: true,
	plugins: [
		{
			resolve: `gatsby-plugin-styled-components`,
			options: {
				displayName: false,
				fileName: false,
			},
		},
		"gatsby-plugin-sass",
		"gatsby-plugin-image",
		"gatsby-plugin-react-helmet",
		"gatsby-plugin-sitemap",
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				icon: "./src/images/icon.png",
			},
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				// extensions: ['.md', '.mdx'],
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
					`gatsby-remark-copy-linked-files`,
					`gatsby-remark-smartypants`,
				],
			},
		},
		"gatsby-plugin-sharp",
		"gatsby-transformer-sharp",
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "waysideshrines",
				path: "./content/waysideshrines",
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
			resolve: "gatsby-plugin-layout",
			options: {
				component: path.resolve(`./src/Layout.jsx`),
			},
		},
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
	],
}

export default config
