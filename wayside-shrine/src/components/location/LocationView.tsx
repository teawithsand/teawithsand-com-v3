import React, { useMemo } from "react"
import styled from "styled-components"

import Map, { fromLonLat, MapIcon, MapView } from "@app/components/map/Map"
import { LocationData } from "@app/domain/location/store"

const DisplayedMap = styled(Map)`
	max-height: 80vh;
`

const ErrorText = styled.span`
	color: red;
	font-weight: bold;
`

const BoldText = styled.span`
	font-weight: bold;
`

const LocationView = (props: { location: LocationData }) => {
	const { location } = props

	const initialView: MapView = useMemo(
		() => ({
			type: "point",
			coordinates: fromLonLat([
				location.coordinates.longitude,
				location.coordinates.latitude,
			]),
			zoom: 10,
		}),
		[location],
	)

	const icons: MapIcon[] = useMemo(() => {
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
						coordinates: fromLonLat([
							location.coordinates.longitude,
							location.coordinates.latitude,
						]),
					},
				],
			},
		]
	}, [location])

	return (
		<div>
			<DisplayedMap initialView={initialView} icons={icons} />
		</div>
	)
}

export default LocationView
