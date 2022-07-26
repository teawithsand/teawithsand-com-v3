import React, { ReactFragment, ReactNode } from "react"
import { Helmet } from "react-helmet"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Seo } from "tws-common/react/components/Seo"
import { Container as ParentContainer } from "tws-common/ui"

const PageContainer = (props: { children?: ReactFragment | ReactNode }) => {
	const language = useAppTranslationSelector(s => s.common.language.language)
	const meta = useAppTranslationSelector(s => s.meta)
	return (
		<ParentContainer className="mt-5">
			<Seo
				title={meta.title}
				description={meta.description}
				language={language}
				type="website"
				websiteData={{}}
				siteName="Szlakiem Kapliczek"
				keywords={["kapliczki", "kapliczka", "krzyż"]}
			/>
			{props.children}
		</ParentContainer>
	)
}
export default PageContainer
