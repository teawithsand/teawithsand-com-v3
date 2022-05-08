import React from "react"

import Layout from "@app/components/layout/Layout"
import BlogPostList from "@app/components/blog/post/BlogPostList"

const PostListPage = () => {
	return (
		<Layout withNoMain={true}>
			<BlogPostList />
		</Layout>
	)
}

export default PostListPage