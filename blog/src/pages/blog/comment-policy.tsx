import React from "react"

import CommentPolicy from "@app/components/blog/commentPolicy/CommentPolicy"
import Layout from "@app/components/layout/Layout"

const PostListPage = () => {
	return (
		<Layout withNoMain={true}>
			<CommentPolicy />
		</Layout>
	)
}

export default PostListPage
