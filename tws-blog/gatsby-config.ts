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
	],
)
const config = makeConfig(
	{
		title: `Teawithsand's blog`,
		siteUrl: `https://teawithsand.com`,
		twitter: "https://twitter.com/teawithsand",
	},
	plugins,
)

export default config
