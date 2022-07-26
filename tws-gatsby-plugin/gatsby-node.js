const TSConfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

const onCreatePage = async ({ page, actions }, config) => {
	let languages = []
	let pageFilter = null
	if (config) {
		languages = config.languages ?? []
		pageFilter = config.pageFilter ?? null
	}

	if (pageFilter === null) {
		// quite rudimentary, but should do.
		pageFilter = path => {
			const innerLangs = languages.map(v => v.toLowerCase())
			for (const l of innerLangs) {
				if (path.startsWith("/" + l + "/")) return false
			}
			return true
		}
	}

	const { createPage } = actions

	for (const lang of languages) {
		if (!pageFilter(page.path)) continue

		createPage({
			...page,
			path: "/" + lang.toLowerCase() + page.path,
			context: {
				...page.context,
				language: lang,
			},
		})
	}
}

const onCreateWebpackConfig = ({
	actions,
	getConfig,
	rules,
	stage,
	loaders,
}) => {
	const config = getConfig()
	const imgsRule = rules.images()

	config.plugins = [...(config.plugins ?? [])]

	const newUrlLoaderRule = {
		...imgsRule,
		test: new RegExp(
			imgsRule.test.toString().replace("svg|", "").slice(1, -1),
		),
	}

	config.module.rules = [
		...(config.module.rules ?? []).filter(rule => {
			if (rule.test) {
				return rule.test.toString() !== imgsRule.test.toString()
			}
			return true
		}),
		{
			test: /.svg$/,
			use: ["@svgr/webpack"],
		},
		newUrlLoaderRule,
	]

	/*
	config.module.rules = [
		...config.module.rules,
		{
			test: /.apk$/i,
			type: "asset/resource",
		},
	]
	*/
	config.resolve.plugins = [
		...(config.resolve.plugins ?? []),
		new TSConfigPathsPlugin(),
	]

	// Required to make yarn link work
	// Also required for yarn's link:... dependencies
	config.resolve.symlinks = false

	if (config.mode === "production") {
		config.devtool = false
	}

	if (stage === "build-javascript") {
		config.output = {
			...config.output,
			filename: `[contenthash].js`,
			chunkFilename: `[contenthash].js`,
		}
		actions.replaceWebpackConfig(config)
	} else {
		actions.replaceWebpackConfig(config)
	}

	if (
		stage === "build-html" ||
		stage === "develop-html" ||
		stage === "develop"
	) {
		config.module = config.module ?? {}
		config.module.rules = config.module.rules ?? {}
		config.module.rules = [
			...config.module.rules,
			{
				test: /xterm|xterm-addon-fit/,
				use: loaders.null(),
			},
		]
		actions.replaceWebpackConfig(config)
	}
}

module.exports = { onCreateWebpackConfig, onCreatePage }
