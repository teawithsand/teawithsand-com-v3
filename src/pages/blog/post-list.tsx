import React from "react"

import Layout from "@app/components/layout/Layout"
import AllBlogPostList from "@app/components/blog/list/AllBlogPostList"

const PostListPage = () => {
	return (
		<Layout withNoMain={true}>
			<AllBlogPostList />
		</Layout>
	)
}

export default PostListPage
