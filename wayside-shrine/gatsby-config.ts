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
		"gatsby-plugin-styled-components",
		"gatsby-plugin-sass",
		"gatsby-plugin-image",
		"gatsby-plugin-react-helmet",
		"gatsby-plugin-sitemap",
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				icon: "src/images/icon.png",
			},
		},
		"gatsby-plugin-mdx",
		"gatsby-plugin-sharp",
		"gatsby-transformer-sharp",
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
