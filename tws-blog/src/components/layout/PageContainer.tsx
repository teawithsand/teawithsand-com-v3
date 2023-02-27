import { useAppTranslation } from "@app/trans/AppTranslation"
import React, { ReactFragment, ReactNode } from "react"
import { Helmet } from "react-helmet"

import { Container as ParentContainer } from "tws-common/ui"

const PageContainer = (props: { children?: ReactFragment | ReactNode }) => {
	const {
		title,
		description,
		info: { twitter },
	} = useAppTranslation()
	return (
		<ParentContainer className="mt-3">
			<Helmet
				htmlAttributes={{
					lang: "en",
				}}
			>
				<title>{title}</title>
				<meta name="description" content={description} />

				<meta name="og:title" content={title} />
				<meta name="og:description" content={description} />
				<meta name="og:type" content="website" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:creator" content={twitter} />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
			</Helmet>

			{props.children}
		</ParentContainer>
	)
}
export default PageContainer
