import NewBlogPostList, { BlogPostListEntry } from "@app/components/blog/newpostlist/NewBlogPostList";
import { blogPostListPath, blogTagPath } from "@app/components/paths";
import { Link } from "gatsby"
import React from "react"

export default (props: { tag: string; entries: BlogPostListEntry[] }) => {
	const { entries, tag } = props
	return (
		<NewBlogPostList
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
