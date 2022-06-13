const path = require(`path`)
const TSConfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

exports.onCreateWebpackConfig = ({
	actions,
	getConfig,
	rules,
	loaders,
	stage,
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

	if (stage === "build-html" || stage === "develop-html") {
		config.module.rules = [
			// {
			// 	test: /react-transition-group/,
			// 	use: loaders.null(),
			// },
			...config.module.rules,
			// {
			// 	test: /react-transition-group/,
			// 	use: loaders.null(),
			// },
		]
		actions.replaceWebpackConfig(config)
	} else {
		actions.replaceWebpackConfig(config)
	}
}
