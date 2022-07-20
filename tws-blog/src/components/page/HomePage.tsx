import PageContainer from "@app/components/layout/PageContainer"
import PostsGrid from "@app/components/post/PostsGrid"
import React from "react"
import { Container } from "tws-common/ui"

const HomePage = () => {
	return (
		<main>
			<PageContainer>
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
			</PageContainer>
		</main>
	)
}
