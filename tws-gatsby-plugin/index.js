const path = require("path")

const BasicSitePluginsStart = [
	// Styling stuff
	{
		resolve: `gatsby-plugin-styled-components`,
		options: {
			displayName: false,
			fileName: false,
		},
	},
	{
		resolve: "gatsby-plugin-sass",
		options: {
			useResolveUrlLoader: true,
			cssLoaderOptions: {
				// camelCase: true,
				modules: {
					exportLocalsConvention: "camelCaseOnly",
				},
			},
		},
	},

	// Image stuff
	{
		resolve: `gatsby-plugin-sharp`,
		options: {
			defaults: {
				formats: ["jpg", "webp", "avif"],
				placeholder: "blurred",
				quality: 50,
				breakpoints: [350, 750, 1080, 1366, 1920],
				backgroundColor: `transparent`,
			},
		},
	},
	"gatsby-transformer-sharp",
	"gatsby-plugin-image",

	// Misc
	"gatsby-plugin-react-helmet",
	"gatsby-plugin-sitemap",
]

const BasicSitePluginsEnd = [
	// Compression has to be at the end
	{
		resolve: "gatsby-plugin-zopfli",
		options: {
			extensions: [
				"css",
				"html",
				"js",
				"svg",
				"txt",
				"json",
				"xml",
				"rss",
				"woff",
				"wasm",
			],
			compression: {
				numiterations: 15,
				blocksplitting: true,
				blocksplittingmax: 15,
			},
		},
	},
]

/**
 * Integrates gatsby-plugin-manifest using path to manifest
 */
const makeManifestPlugin = (iconPath, otherOptions = undefined) => ({
	resolve: "gatsby-plugin-manifest",
	options: {
		icon: iconPath,
		...(otherOptions ?? {}),
	},
})

const makeLayoutPlugin = (layoutPath, otherOptions = undefined) => ({
	resolve: "gatsby-plugin-layout",
	options: {
		component: path.resolve(layoutPath),
		...(otherOptions ?? {}),
	},
})

/**
 * Some reasonable defaults to make gatsby-transformer-remark and friends like
 * - gatsby-remark-image
 * - gatsby-remark-copy-linked-files
 * - gatsby-remark-smartypants
 */
const GatsbyTransformerRemarkPlugins = [
	{
		resolve: `gatsby-transformer-remark`,
		options: {
			// extensions: ['.md', '.mdx'],
			plugins: [
				{
					resolve: `gatsby-remark-images`,
					options: {
						srcSetBreakpoints: [1920 / 8, 1920 / 4, 1920 / 2, 1920],
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
]

const mergePlugins = (...configs) => {
	configs = configs.map(c =>
		c.map(entry => {
			if (typeof entry === "string") {
				return {
					resolve: entry,
				}
			} else {
				return entry
			}
		}),
	)
	let theConfig = [...configs[0]]

	for (const config of configs.slice(1)) {
		let i = 0
		for (const plugin of config) {
			try {
				const currentPluginDefinitionIndex = theConfig.findIndex(
					currentPlugin => currentPlugin.resolve === plugin.resolve,
				)

				if (
					currentPluginDefinitionIndex >= 0 &&
					!/source/.test(plugin.resolve)
				) {
					theConfig[i] = plugin
				} else {
					theConfig.push(plugin)
				}
			} finally {
				i++
			}
		}
	}

	return theConfig
}

const customizeDefaultPlugins = (...configs) =>
	mergePlugins(BasicSitePluginsStart, ...configs, BasicSitePluginsEnd)

const makeConfig = (siteMetadata, plugins) => ({
	flags: {
		DEV_SSR: !!process.env.GATSBY_DEV_SSR,
	},
	siteMetadata: siteMetadata,
	// More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
	// If you use VSCode you can also use the GraphQL plugin
	// Learn more at: https://gatsby.dev/graphql-typegen
	graphqlTypegen: true,
	plugins,
})

const SelfPlugins = ["tws-gatsby-plugin"]

module.exports = {
	BasicSitePluginsStart,
	BasicSitePluginsEnd,
	GatsbyTransformerRemarkPlugins,

	SelfPlugins,

	makeManifestPlugin,
	customizeDefaultPlugins,
	mergePlugins,
	makeLayoutPlugin,
	makeConfig,
}
