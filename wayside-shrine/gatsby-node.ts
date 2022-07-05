import * as path from "path"
import type { GatsbyNode } from "gatsby"

export const createPages: GatsbyNode["createPages"] = async ({
	graphql,
	actions,
	reporter,
}) => {
	const { createPage } = actions

	// Create pages for all shrines
	{
		// Define a template for blog post
		const templatePath = path.resolve(`./src/templates/wayside-shrine.tsx`)

		// Get all markdown blog posts sorted by date

		// TODO(teawithsand): sort posts by date
		const result = await graphql(`
			query WaysideShrinesForPages {
				allFile(
					filter: {
						sourceInstanceName: { eq: "waysideshrines" }
						name: { eq: "index" }
						extension: { eq: "md" }
					}
				) {
					nodes {
						id
						childMarkdownRemark {
							fields {
								path
							}
							frontmatter {
								slug
								title
								language
							}
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

		const shrines = (result.data as any).allFile.nodes.filter(n => !!n)

		if (shrines.length > 0) {
			shrines.forEach((shrine, index) => {
				const previousShrineId =
					index === 0 ? null : shrines[index - 1].id
				const nextShrineId =
					index === shrines.length - 1 ? null : shrines[index + 1].id

				const shrinePath = shrine.childMarkdownRemark.fields.path
				createPage({
					path: shrinePath,
					component: templatePath,
					context: {
						id: shrine.id,
						previousShrineId,
						nextShrineId,
					},
				})
			})
		}
	}

	/*
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
	*/
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
	node,
	actions,
	getNode,
}) => {
	const { createNodeField } = actions

	if (
		node.internal.type === `MarkdownRemark` &&
		typeof node.frontmatter === "object"
	) {
		const slug = (node as any).frontmatter.slug ?? ""
		const path = slug.startsWith("/")
			? "/shrine/view" + slug
			: "/shrine/view/" + slug

		createNodeField({
			node,
			name: "path",
			value: path,
		})
		createNodeField({
			node,
			name: "slug",
			value: slug,
		})
	}
}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
	({ actions }) => {
		// TODO(teawithsand): add types here, so no error happens when there is no posts
		const { createTypes } = actions

		createTypes(`
	type SiteSiteMetadata {
		siteUrl: String
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
		language: String
		coordinates: [Float]
	}
	type Fields {
		slug: String
	}
	`)
	}
