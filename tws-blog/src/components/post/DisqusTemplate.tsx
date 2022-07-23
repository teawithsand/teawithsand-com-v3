import * as Disqus from "gatsby-plugin-disqus"
import React from "react"

const DisqusTemplate = (props: {
	pageURL: string
	pageIdentifier: string
	pageTitle: string
}) => {
	/* Page contents */
	const { pageURL, pageIdentifier, pageTitle } = props

	return (
		<Disqus.Disqus
			config={{
				/* Replace PAGE_URL with your post's canonical URL variable */
				url: pageURL,
				/* Replace PAGE_IDENTIFIER with your page's unique identifier variable */
				identifier: pageIdentifier,
				/* Replace PAGE_TITLE with the title of the page */
				title: pageTitle,
			}}
		/>
	)
}

export default DisqusTemplate
