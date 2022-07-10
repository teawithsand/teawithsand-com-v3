import React, { useEffect, useState } from "react"

import PageContainer from "@app/components/layout/PageContainer"
import LocationCurrentDisplay from "@app/components/location/LocationCurrentDisplay"

import { getNowTimestamp, TimestampMs } from "tws-common/lang/time/Timestamp"
import {
	GeolocationError,
	GeolocationHelper,
	GeolocationPosition,
} from "tws-common/webapi/geolocation"

const LocationLocatePage = () => {
	const [lastUpdate, setLastUpdate] = useState<TimestampMs>(getNowTimestamp())
	const [position, setPosition] = useState<GeolocationPosition | null>(null)
	const [error, setError] = useState<GeolocationError | null>(null)

	useEffect(() => {
		const claim = GeolocationHelper.createReadClaim({
			enableHighAccuracy: true,
			maximumAge: Infinity,
			timeout: 60 * 1000,
		})

		claim.bus.addSubscriber(e => {
			if (e.type === "error") {
				setError(e.error)
			} else if (e.type === "position") {
				setPosition(e.position)
			}
		})

		setLastUpdate(getNowTimestamp())

		return () => {
			claim.close()
		}
	}, [])

	return (
		<PageContainer>
			<main>
				<LocationCurrentDisplay
					lastUpdate={
						position
							? (position.timestamp as TimestampMs)
							: lastUpdate
					}
					position={position?.coordinates ?? null}
					error={error ? error.code : null}
				/>
			</main>
		</PageContainer>
	)
}

export default LocationLocatePage
