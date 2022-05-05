import React from "react"
import { graphql } from "gatsby"

import Layout from "@app/components/layout/Layout"
import BlogPostList from "@app/components/blog/BlogPostList"

const PostListPage = ({ data }: { data: any }) => {
	return (
		<Layout withNoMain={true}>
			<BlogPostList />
		</Layout>
	)
}

export default PostListPage

export const pageQuery = graphql`
	query {
        allFile(
            filter: {
                sourceInstanceName: { eq: "blog" }
                relativePath: { regex: "/\\.md/" }
            }
            sort: {
                fields: [childMarkdownRemark___frontmatter___date]
                order: ASC
            }
        ) {
            nodes {
                childMarkdownRemark {
                    id
                    fields {
                        slug
                    }
                    frontmatter{
                        title
                        date(formatString: "YYYY-MM-DD")
                    }
                    excerpt(pruneLength: 160)
                }
            }
        }
    }
`
