const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const TSConfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

exports.createPages = async ({ graphql, actions, reporter }) => {
	const { createPage } = actions

	// Create all pages for all blog posts
	{
		// Define a template for blog post
		const templatePath = path.resolve(`./src/templates/blog-post.js`)

		// Get all markdown blog posts sorted by date
		const result = await graphql(`
			{
				allMarkdownRemark(
					filter: { fields: { sourceName: { eq: "blog" } } }
				) {
					nodes {
						id
						fields {
							slug
							sourceName
							path
						}
						excerpt
						html
						frontmatter {
							date
							title
						}
					}
				}
			}
		`)

		if (result.errors) {
			reporter.panicOnBuild(
				`There was an error loading blog posts`,
				result.errors,
			)
			return
		}

		const posts = result.data.allMarkdownRemark.nodes.filter(n => !!n)

		// Create blog posts pages
		// But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
		// `context` is available in the template as a prop and as a variable in GraphQL

		if (posts.length > 0) {
			posts.forEach((post, index) => {
				const previousPostId = index === 0 ? null : posts[index - 1].id
				const nextPostId =
					index === posts.length - 1 ? null : posts[index + 1].id

				const postPath = post.fields.path
				createPage({
					path: postPath,
					component: templatePath,
					context: {
						id: post.id,
						previousPostId,
						nextPostId,
					},
				})
			})
		}
	}

	// Create all pages for all blog posts
	{
		// Define a template for blog post
		const templatePath = path.resolve(`./src/templates/blog-tags.js`)

		// Get all markdown blog posts sorted by date
		const result = await graphql(`
			{
				allMarkdownRemark(
					filter: { fields: { sourceName: { eq: "blog" } } }
				) {
					group(field: frontmatter___tags) {
						tag: fieldValue
					}
				}
			}
		`)

		if (result.errors) {
			reporter.panicOnBuild(
				`There was an error loading blog posts by tags`,
				result.errors,
			)
			return
		}

		const postByTags = result.data.allMarkdownRemark.group
		// Create blog posts pages
		// But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
		// `context` is available in the template as a prop and as a variable in GraphQL

		if (postByTags.length > 0) {
			postByTags.forEach(post => {
				createPage({
					path: "/blog/tag/" + post.tag,
					component: templatePath,
					context: {
						tag: post.tag,
					},
				})
			})
		}
	}
}

exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions

	if (node.internal.type === `MarkdownRemark`) {
		const slug = createFilePath({ node, getNode })

		createNodeField({
			name: `slug`,
			node,
			value: slug,
		})

		const fileNode = getNode(node.parent)

		createNodeField({
			node,
			name: "sourceName",
			value: fileNode.sourceInstanceName,
		})

		const path = slug.startsWith("/")
			? "/blog/post" + slug
			: "/blog/post/" + slug
		createNodeField({
			node,
			name: "path",
			value: path,
		})
	}
}

exports.createResolvers = ({ createResolvers }) => {}

exports.createSchemaCustomization = ({ actions, schema }) => {
	// TODO(teawithsand): add types here, so no error happens when there is no posts
	const { createTypes } = actions

	createTypes(`
	type SiteSiteMetadata {
		author: Author
		siteUrl: String
	}
	type Author {
		name: String
		summary: String
	}
	type MarkdownRemark implements Node {
		frontmatter: Frontmatter
		fields: Fields
	}
	type Frontmatter {
		title: String
		description: String
		date: Date @dateformat
		tags: [String]
	}
	type Fields {
		slug: String
	}
	`)
}

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
	config.module.rules = [
		...config.module.rules,
		{
			test: /.apk$/i,
			type: "asset/resource",
		},
	]
	config.resolve.plugins = [
		...(config.resolve.plugins ?? []),
		new TSConfigPathsPlugin(),
	]

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
