import React, { useMemo } from "react"

import PageBoundary from "@app/components/layout/PageBoundary"
import PageContainer from "@app/components/layout/PageContainer"
import LocationCurrentDisplay from "@app/components/location/LocationCurrentDisplay"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"
import { useWatchGeolocation } from "tws-common/webapi/geolocation"

const LocateMePage = () => {
	const config = useMemo(
		() => ({
			enableHighAccuracy: true,
			maximumAge: Infinity,
			timeout: Infinity,
		}),
		[],
	)
	const geolocation = useWatchGeolocation(config)

	return (
		<PageContainer>
			<main>
				<PageBoundary>
					<LocationCurrentDisplay
						lastUpdate={geolocation.lastUpdateTs}
						position={geolocation.position?.coordinates ?? null}
						error={geolocation.error?.code ?? null}
					/>
				</PageBoundary>
			</main>
		</PageContainer>
	)
}

export default wrapNoSSR(LocateMePage)
