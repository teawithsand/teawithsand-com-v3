const TSConfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

const onCreateWebpackConfig = ({ actions, getConfig, rules, stage }) => {
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
}

module.exports = { onCreateWebpackConfig }
