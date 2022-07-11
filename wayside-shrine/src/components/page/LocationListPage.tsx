import React, { Suspense } from "react"

import PageContainer from "@app/components/layout/PageContainer"
import LocationList from "@app/components/location/LocationList"
import { useLocationList } from "@app/domain/location/operation"

import { ComposedErrorBoundary } from "tws-common/react/components/error-boundary"
import { wrapNoSSR } from "tws-common/react/components/NoSSR"
import LoadingSpinner from "tws-common/ui/LoadingSpinner"

const InnerPage = () => {
	const { data } = useLocationList()
	return <LocationList locations={data ?? []} />
}

const LocationListPage = () => {
	return (
		<PageContainer>
			<main>
				<ComposedErrorBoundary fallback={<InnerPage />}>
					<Suspense fallback={<LoadingSpinner />}>
						<InnerPage />
					</Suspense>
				</ComposedErrorBoundary>
			</main>
		</PageContainer>
	)
}

export default wrapNoSSR(LocationListPage)
