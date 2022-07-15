import React, { useMemo } from "react"
import styled from "styled-components"

import PageBoundary from "@app/components/layout/PageBoundary"
import PageContainer from "@app/components/layout/PageContainer"
import { SimplifiedLocationForm } from "@app/components/location/form/SimplifiedLocationForm"
import LocationCurrentDisplay from "@app/components/location/LocationCurrentDisplay"
import { useUpsertLocation } from "@app/domain/location/operation"
import { locationShowPath } from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { getNowTimestamp } from "tws-common/lang/time/Timestamp"
import { generateUUID } from "tws-common/lang/uuid"
import { wrapNoSSR } from "tws-common/react/components/NoSSR"
import { useNavigate } from "tws-common/react/hook/useNavigate"
import { Button } from "tws-common/ui"
import { useWatchGeolocation } from "tws-common/webapi/geolocation"

const ParentContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-auto-flow: row;
	grid-auto-rows: auto;
	gap: 1rem;
`

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

	const mutation = useUpsertLocation()

	const trans = useAppTranslationSelector(s => s.location.locate)
	const navigate = useNavigate()

	return (
		<PageContainer>
			<main>
				<PageBoundary>
					<ParentContainer>
						<LocationCurrentDisplay
							lastUpdate={geolocation.lastUpdateTs}
							position={geolocation.position?.coordinates ?? null}
							error={geolocation.error?.code ?? null}
						/>
						{geolocation.error ? (
							<Button
								variant="secondary"
								onClick={() => geolocation.restart()}
							>
								{trans.tryAgain}
							</Button>
						) : null}
						<SimplifiedLocationForm
							disabled={
								!geolocation.position ||
								!geolocation.position.coordinates
							}
							onSubmit={async data => {
								const position = geolocation.position
								if (!position || !position.coordinates)
									throw new Error("No position")

								const id = generateUUID()
								await mutation.mutateAsync({
									id: id,
									data: {
										coordinates: {
											latitude:
												position.coordinates.latitude,
											longitude:
												position.coordinates.longitude,
										},
										description: data.description,
										name: data.name,
										timestamp: getNowTimestamp(),
									},
								})

								navigate(locationShowPath(id))
							}}
						/>
					</ParentContainer>
				</PageBoundary>
			</main>
		</PageContainer>
	)
}

export default wrapNoSSR(LocateMePage)
