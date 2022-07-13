import React from "react"

import PageBoundary from "@app/components/layout/PageBoundary"
import PageContainer from "@app/components/layout/PageContainer"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const LocationAddPage = () => {
	return (
		<PageContainer>
			<main>
				<PageBoundary></PageBoundary>
			</main>
		</PageContainer>
	)
}

export default wrapNoSSR(LocationAddPage)
