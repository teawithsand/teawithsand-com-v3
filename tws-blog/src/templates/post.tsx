import PageContainer from "@app/components/layout/PageContainer"
import {
	convertPost,
	convertPostHeader,
} from "@app/components/page/PostListPageTemplate"
import { PostDisplay } from "@app/components/post/PostDisplay"
import { Post, PostHeader } from "@app/domain/Post"
import { graphql } from "gatsby"
import * as React from "react"
import { asNonNullable } from "tws-common/typing/required"

const PostTemplate = (props: { data: Queries.PostTemplateQuery }) => {
	const { data } = props
	const n = asNonNullable(
		asNonNullable(data?.allFile?.nodes)[0].childMarkdownRemark,
	)

	const post: Post = convertPost(n)
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
