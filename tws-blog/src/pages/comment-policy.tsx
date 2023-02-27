import PageContainer from "@app/components/layout/PageContainer"
import * as React from "react"

const CommentPolicyPage = () => {
	return (
		<PageContainer>
			<header>
				<h1>Comment policy</h1>
			</header>
			<section>
				<p>
					The comment policy is simple: I{"'"}ll remove comments I
					consider bad/offending. Aside from that, I'll try to remove as few of them as possible.
				</p>
				<p>
					This is known as{" "}
					<a href="https://en.wikipedia.org/wiki/Benevolent_dictator_for_life">
						BDFL
					</a>{" "}
					model of managing something.
				</p>
			</section>
		</PageContainer>
	)
}

export default CommentPolicyPage
