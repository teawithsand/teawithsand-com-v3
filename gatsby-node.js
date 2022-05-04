const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const zlib = require("zlib")
const CompressionPlugin = require("compression-webpack-plugin")
const TSConfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

exports.createPages = async ({ graphql, actions, reporter }) => {
	const { createPage } = actions

	// Define a template for blog post
	const blogPost = path.resolve(`./src/templates/blog-post.js`)

	// Get all markdown blog posts sorted by date
	const result = await graphql(
		`
			query {
				allFile(filter: { 
					sourceInstanceName: { eq: "blog" }
					relativePath: { regex: "/\\\\.md/" }
				}) {
					nodes {
						childMarkdownRemark {
							id
							fields {
								slug
							}   
						}
					}
				}
			}

		`
	)

	if (result.errors) {
		reporter.panicOnBuild(
			`There was an error loading your blog posts`,
			result.errors
		)
		return
	}

	const posts = result.data.allFile.nodes.map(n => n.childMarkdownRemark)

	// Create blog posts pages
	// But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
	// `context` is available in the template as a prop and as a variable in GraphQL


	if (posts.length > 0) {
		posts.forEach((post, index) => {
			const previousPostId = index === 0 ? null : posts[index - 1].id
			const nextPostId =
				index === posts.length - 1 ? null : posts[index + 1].id

			console.log("Post path", '/blog/post' + post.fields.slug)
			createPage({
				path: '/blog/post' + post.fields.slug,
				component: blogPost,
				context: {
					id: post.id,
					previousPostId,
					nextPostId,
				},
			})
		})
	} 
}

exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions

	if (node.internal.type === `MarkdownRemark`) {
		const value = createFilePath({ node, getNode })

		createNodeField({
			name: `slug`,
			node,
			value,
		})
	}
}

exports.createSchemaCustomization = ({ actions }) => {
	const { createTypes } = actions

	// Explicitly define the siteMetadata {} object
	// This way those will always be defined even if removed from gatsby-config.js

	// Also explicitly define the Markdown frontmatter
	// This way the "MarkdownRemark" queries will return `null` even when no
	// blog posts are stored inside "content/blog" instead of returning an error
	createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
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

	config.plugins = [
		...(config.plugins ?? []),
		new CompressionPlugin({
			filename: "[path][base].gz",
			test: /\.(js|css|svg|json|html|xml).*$/i,
			threshold: 0,
			algorithm: "gzip",
			compressionOptions: {
				level: 9,
			},
		}),
		new CompressionPlugin({
			filename: "[path][base].br",
			test: /\.(js|css|svg|json|html|xml).*$/i,
			threshold: 0,
			algorithm: "brotliCompress",
			compressionOptions: {
				params: {
					[zlib.constants.BROTLI_PARAM_QUALITY]:
						zlib.constants.BROTLI_MAX_QUALITY,
				},
			},
		}),
	]

	const newUrlLoaderRule = {
		...imgsRule,
		test: new RegExp(
			imgsRule.test.toString().replace("svg|", "").slice(1, -1)
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
