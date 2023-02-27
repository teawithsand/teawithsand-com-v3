import PageContainer from "@app/components/layout/PageContainer"
import { homePath } from "@app/paths"
import { Link } from "gatsby"
import * as React from "react"

const NotFoundPage = () => {
	return (
		<main>
			<PageContainer>
				<h1
					style={{
						textAlign: "center",
					}}
				>
					<Link to={homePath}>Page not found - go to home page</Link>
				</h1>
			</PageContainer>
		</main>
	)
}

export default NotFoundPage
