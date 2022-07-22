import PageContainer from "@app/components/layout/PageContainer"
import { PostDisplay } from "@app/components/post/PostDisplay"
import { Post, PostHeader } from "@app/domain/Post"
import { graphql } from "gatsby"
import * as React from "react"

const PostTemplate = (props: { data: Queries.PostTemplateQuery }) => {
	const { data } = props
	const n = data.allFile.nodes[0].childMarkdownRemark
	if (!n || !n.fields || !n.frontmatter)
		throw new Error("Some fields do not exist, but they should")

	const header: PostHeader = {
		createdAt: n.frontmatter.createdAt || "",
		path: n.fields.path || "",
		timeToRead: n.timeToRead || 0,
		tags: (n.frontmatter.tags || []).map(v => v || ""),
		title: n.frontmatter.title || "",
		slug: n.frontmatter.slug || "",
		featuredImage: n.frontmatter.featuredImage?.childImageSharp,
	}

	const post: Post = {
		header,
		contentHTML: n.html ?? "",
	}
	return (
		<main>
			<PageContainer>
				<PostDisplay post={post} nextPost={null} prevPost={null} />
			</PageContainer>
		</main>
	)
}

export default PostTemplate

export const query = graphql`
	query PostTemplate($id: String!) {
		allFile(
			filter: {
				sourceInstanceName: { eq: "blog" }
				name: { eq: "index" }
				extension: { eq: "md" }
				id: { eq: $id }
			}
		) {
			nodes {
				childMarkdownRemark {
					...Post
				}
			}
		}
	}
`
