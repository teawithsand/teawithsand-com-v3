import React from "react"

import Layout from "@app/components/layout/Layout"
import NewAllBlogPostList from "@app/components/blog/newpostlist/NewAllBlogPostList"

const PostListPage = () => {
	return (
		<Layout withNoMain={true}>
			<NewAllBlogPostList />
		</Layout>
	)
}

export default PostListPage
