import PostsGrid from "@app/components/post/PostsGrid"
import * as React from "react"
import { Container } from "tws-common/ui"
import TeaAnimation from "tws-common/ui/TeaAnimation"

// markup
const IndexPage = () => {
	return (
		<main>
			<Container className="mt-5">
				<PostsGrid
					posts={[
						{
							createdAt: new Date().toString(),
							readingTime: "2 minutes",
							tags: ["JS", "TS", "Programming", "English"],
							title: "Introduction to JS",
							featuredImage: null,
							lastEditedAt: null,
							path: "/",
						},
					]}
				/>
			</Container>
		</main>
	)
}

export default IndexPage
