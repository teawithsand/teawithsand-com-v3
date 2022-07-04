import {
	customizeDefaultPlugins,
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
)

const config = makeConfig(
	{
		title: `tws-paint-app`,
		siteUrl: `https://paint.teawithsand.com`,
	},
	plugins,
)

export default config
