import * as fs from "fs"
import {
	customizeDefaultPlugins,
	GatsbyTransformerRemarkPlugins,
	makeConfig,
	makeLayoutPlugin,
	makeManifestPlugin,
	makeSelfPlugin,
} from "tws-gatsby-plugin"

const plugins = customizeDefaultPlugins(
	[
		makeManifestPlugin("./src/images/icon.png"),
		makeLayoutPlugin("./src/Layout.jsx"),
	],
	[
		makeSelfPlugin({
			languages: [],
		}),
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
		submissionsEmail: "submissions@szlakiemkapliczek.pl",
	},
	plugins,
)

export default config
