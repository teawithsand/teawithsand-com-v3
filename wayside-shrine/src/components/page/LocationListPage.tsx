import React from "react"

import PageBoundary from "@app/components/layout/PageBoundary"
import PageContainer from "@app/components/layout/PageContainer"
import LocationList from "@app/components/location/LocationList"
import { useLocationList } from "@app/domain/location/operation"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"

const InnerPage = () => {
	const { data } = useLocationList()
	return <LocationList locations={data ?? []} />
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
