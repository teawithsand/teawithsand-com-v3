import {
	customizeDefaultPlugins,
	makeConfig,
	makeLayoutPlugin,
	SelfPlugins,
} from "tws-gatsby-plugin"

const plugins = customizeDefaultPlugins(
	[
		// makeManifestPlugin("./src/images/icon.png"), // TODO(teawithsand): add manifest in future
		makeLayoutPlugin(`./src/Layout.jsx`),
	],
	SelfPlugins,
)

const config = makeConfig(
	{
		title: `PalmABooks PWA`,
		siteUrl: `https://www.palmabooks.com`,
	},
	plugins,
)

export default config
