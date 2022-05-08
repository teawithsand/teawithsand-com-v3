import BlogPostListDisplay, {
	BlogPostListEntry,
} from "@app/components/blog/post/BlogPostListDisplay"
import React from "react"

export default (props: { tag: string; entries: BlogPostListEntry[] }) => {
	const { entries, tag } = props
	return <BlogPostListDisplay entries={entries} />
}
