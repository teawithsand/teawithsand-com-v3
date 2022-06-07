import { Link } from "gatsby"
import React from "react"

import BlogPostList, {
	BlogPostListEntry,
} from "@app/components/blog/list/BlogPostList"
import { blogPostListPath, blogTagPath } from "@app/components/paths"

export default (props: { tag: string; entries: BlogPostListEntry[] }) => {
	const { entries, tag } = props
	return (
		<BlogPostList
			title={
				<>
					Posts with tag <Link to={blogTagPath(tag)}>{tag}</Link>
				</>
			}
			subtitle={
				<>
					For all post list click{" "}
					<Link to={blogPostListPath}>here</Link>
				</>
			}
			entries={entries}
		/>
	)
}
