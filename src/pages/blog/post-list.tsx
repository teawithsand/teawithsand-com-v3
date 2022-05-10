import React from "react"

import AllBlogPostList from "@app/components/blog/list/AllBlogPostList"
import Layout from "@app/components/layout/Layout"

const PostListPage = () => {
	return (
		<Layout withNoMain={true}>
			<AllBlogPostList />
		</Layout>
	)
}

export default PostListPage
