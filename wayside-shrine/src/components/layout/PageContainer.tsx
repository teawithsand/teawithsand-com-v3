import React, { ReactFragment, ReactNode } from "react"
import { Helmet } from "react-helmet"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Container as ParentContainer } from "tws-common/ui"

const PageContainer = (props: { children?: ReactFragment | ReactNode }) => {
	const language = useAppTranslationSelector(s => s.common.language)
	const meta = useAppTranslationSelector(s => s.meta)
	return (
		<ParentContainer className="mt-5">
			<Helmet
				htmlAttributes={{
					lang: language.singlePartCode.toLowerCase(),
				}}
			>
				<title>{meta.title}</title>
				<meta name="description" content={meta.description} />
				<meta name="og:title" content={meta.title} />
				<meta name="og:description" content={meta.description} />
				<meta name="og:type" content="website" />
				
				{/*
				<meta name="og:title" content={title} />
				<meta name="og:description" content={description} />
				<meta name="og:type" content="website" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:creator" content={twitter} />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				*/}
			</Helmet>
			{props.children}
		</ParentContainer>
	)
}
export default PageContainer
