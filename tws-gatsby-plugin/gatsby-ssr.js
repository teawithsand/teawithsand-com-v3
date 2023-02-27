// Contents of this file
// were taken from
// https://github.com/tgallacher/gatsby-plugin-remove-generator/blob/master/src/gatsby-ssr.js
// Commit 36289f0

const isGeneratorTag = (type, name) => type === "meta" && name === "generator"

/**
 *
 * @param apiContext Context provided by Gatsby
 * @param pluginOpts User supplied plugin options
 * @see https://www.gatsbyjs.org/docs/ssr-apis/#onPreRenderHTML
 */
exports.onPreRenderHTML = (
	{ getHeadComponents, replaceHeadComponents },
	{ removeVersionOnly = false, content } = {},
) => {
	// Remove generator tag
	{
		// TODO: something strange going on when inlining this below. Leave here for now
		const keepTag = removeVersionOnly || content != undefined
		const headComponents = getHeadComponents()
			.map(c =>
				isGeneratorTag(c.type, c.props ? c.props.name : "")
					? Object.assign({}, c, {
							props: Object.assign({}, c.props, {
								content: content || "Gatsby",
							}),
					  })
					: c,
			)
			.filter(({ type, props: { name, content } = {} }) =>
				keepTag ? true : !isGeneratorTag(type, name),
			)

		replaceHeadComponents(headComponents)
	}

	// Do not render CSS into HTML directly
	{
		if (process.env.NODE_ENV === "production") {
			getHeadComponents().forEach(el => {
				if (el.type === "style" && el.props["data-href"]) {
					// <- this was the issue
					el.type = "link"
					el.props["href"] = el.props["data-href"]
					el.props["rel"] = "stylesheet"
					el.props["type"] = "text/css"

					delete el.props["data-href"]
					delete el.props["dangerouslySetInnerHTML"]
				}
			})
		}
	}
}
