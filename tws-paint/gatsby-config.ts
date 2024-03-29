import {
	customizeDefaultPlugins,
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
			languages: ["en-US"],
		}),
	],
)

const config = makeConfig(
	{
		siteUrl: `https://paint.teawithsand.com`,
	},
	plugins,
)

export default config
