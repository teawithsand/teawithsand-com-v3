import PostListPageTemplate, {
	convertPostHeader,
} from "@app/components/page/PostListPageTemplate"
import { graphql } from "gatsby"
import * as React from "react"
import { asNonNullable } from "tws-common/typing/required"

const IndexPage = (props: { data: Queries.PostListQuery }) => {
	const headers = props.data.allFile.nodes
		.map(v => v.childMarkdownRemark)
		.map(v => convertPostHeader(asNonNullable(v)))

	return (
		<PostListPageTemplate
			headers={headers}
			heading={
				<>
					<header>
						<h1>All blog posts ({headers.length})</h1>
					</header>
				</>
			}
		/>
	)
}

export default IndexPage

export const query = graphql`
	query PostList {
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
		) {
			nodes {
				childMarkdownRemark {
					...PostHeader
				}
			}
		}
	}
`
