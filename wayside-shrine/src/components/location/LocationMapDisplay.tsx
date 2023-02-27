import React, { useEffect, useState } from "react"
import styled from "styled-components"

import Map from "@app/components/map/Map"
import { LocationData } from "@app/domain/location/store"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { getNowTimestamp, TimestampMs } from "tws-common/lang/time/Timestamp"
import { Table } from "tws-common/ui"
import { GeolocationErrorCode } from "tws-common/webapi/geolocation"

const DisplayedMap = styled(Map)`
	max-height: 60vh;
`

const ErrorText = styled.span`
	color: red;
	font-weight: bold;
`

const BoldText = styled.span`
	font-weight: bold;
`

const LocationMapDisplay = (props: { location: LocationData }) => {
	/*

	const [initialView, setInitialView] = useState<MapView | null>(null)

	const coordinates = position
		? fromLonLat([position.longitude, position.latitude])
		: null

	useEffect(() => {
		if (!initialView && coordinates) {
			setInitialView({
				type: "point",
				coordinates: coordinates,
				zoom: 10,
			})
		}
	}, [position])

	const icons: MapIcon[] = useMemo(() => {
		if (coordinates) {
			return [
				{
					display: {
						src: "https://openlayers.org/en/latest/examples/data/icon.png",
						anchor: [0.5, 46],
						anchorXUnits: "fraction",
						anchorYUnits: "pixels",
					},
					locations: [
						{
							name: "User",
							coordinates: coordinates,
						},
					],
				},
			]
		} else {
			return []
		}
	}, [position])

	{
		initialView && <DisplayedMap initialView={initialView} icons={icons} />
	}
	*/

	return <div>NIY</div>
}

export default LocationMapDisplay
