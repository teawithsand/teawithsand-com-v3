import React from "react"

import PageBoundary from "@app/components/layout/PageBoundary"
import PageContainer from "@app/components/layout/PageContainer"
import { useGetLocation } from "@app/domain/location/operation"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"
import { useGetParamsObject } from "tws-common/react/hook/useGetParams"

const InnerPage = () => {
	const { id } = useGetParamsObject()
	const { data } = useGetLocation(id ?? "")
	return <>{JSON.stringify(data)}</>
}

const LocationListPage = () => {
	return (
		<PageContainer>
			<main>
				<PageBoundary>
					<InnerPage />
				</PageBoundary>
			</main>
		</PageContainer>
	)
}

export default wrapNoSSR(LocationListPage)
