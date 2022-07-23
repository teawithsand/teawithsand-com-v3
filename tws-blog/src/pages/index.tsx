import HomeBio from "@app/components/bio/HomeBio"
import PostListPageTemplate, {
	convertPostHeader,
} from "@app/components/page/PostListPageTemplate"
import { graphql } from "gatsby"
import * as React from "react"
import { asNonNullable } from "tws-common/typing/required"

const IndexPage = (props: { data: Queries.HomePagePostsQuery }) => {
	const headers = props.data.allFile.nodes
		.map(v => v.childMarkdownRemark)
		.map(v => convertPostHeader(asNonNullable(v)))

	return (
		<PostListPageTemplate
			headers={headers}
			heading={
				<>
					<header>
						<HomeBio />
					</header>
					<h2>Latest blog posts</h2>
				</>
			}
		/>
	)
}

export default IndexPage

export const query = graphql`
	query HomePagePosts {
		allFile(
			filter: {
				sourceInstanceName: { eq: "blog" }
				name: { eq: "index" }
				extension: { eq: "md" }
			}
			sort: {
				fields: [childMarkdownRemark___frontmatter___createdAt]
				order: DESC
			}
			limit: 6
		) {
			nodes {
				childMarkdownRemark {
					...PostHeader
				}
			}
		}
	}
`
