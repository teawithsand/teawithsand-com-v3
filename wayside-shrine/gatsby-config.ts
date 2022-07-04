import {
	GatsbyTransformerRemarkPlugins,
	customizeDefaultPlugins,
	makeManifestPlugin,
	makeLayoutPlugin,
	makeConfig,
} from "tws-gatsby-plugin"

import * as fs from "fs"

const plugins = customizeDefaultPlugins(
	[
		makeManifestPlugin("./src/images/icon.png"),
		makeLayoutPlugin("./src/Layout.jsx"),
	],
	GatsbyTransformerRemarkPlugins,
	[
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
	],
)
// JIC debugging is here
/*
fs.writeFileSync(
	"/workspaces/tws_blog/wayside-shrine/debuginfo.json",
	JSON.stringify(plugins),
)
*/
const config = makeConfig(
	{
		title: `wayside-shrine`,
		siteUrl: `https://szlakiemkapliczek.pl`,
	},
	plugins,
)

export default config
