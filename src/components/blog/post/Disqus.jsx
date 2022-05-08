import { Disqus } from 'gatsby-plugin-disqus';
import React from "react"

const DisqusTemplate = ({
	pageURL,
	pageIdentifier,
	pageTitle,
}) => (
	/* Page contents */

	<Disqus
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

export default DisqusTemplate