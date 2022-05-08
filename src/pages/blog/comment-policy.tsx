import React from "react"

import Layout from "@app/components/layout/Layout"
import CommentPolicy from "@app/components/blog/commentPolicy/CommentPolicy"

const PostListPage = () => {
	return (
		<Layout withNoMain={true}>
			<CommentPolicy />
		</Layout>
	)
}

export default PostListPage
