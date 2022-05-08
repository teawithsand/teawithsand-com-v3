import BlogPostListDisplay, {
	BlogPostListEntry,
} from "@app/components/blog/post/BlogPostListDisplay"
import React from "react"

export default (props: { entries: BlogPostListEntry[] }) => {
	const { entries } = props
	return <BlogPostListDisplay entries={entries} />
}
