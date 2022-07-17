import React, { useMemo } from "react"
import styled from "styled-components"

import Map, {
	coordinatesToDMS,
	fromLonLat,
	MapIcon,
	MapView,
} from "@app/components/map/Map"
import { LocationData } from "@app/domain/location/store"
import { locationEditPath } from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Button, ButtonGroup } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

const DisplayedMap = styled(Map)`
	max-height: 80vh;
`
const PageContainer = styled.div`
	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: auto;
	grid-template-columns: 1fr;
	gap: 1rem;
`

const LocationView = (props: { location: LocationData; id?: string }) => {
	const { location } = props
	const id = props.id ?? null

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

	const trans = useAppTranslationSelector(s => s.location.display)

	return (
		<PageContainer>
			<div>
				<h1>
					{location.name ? location.name : <em>{trans.noName}</em>}
				</h1>
				<p>
					{location.description ? (
						location.description
					) : (
						<em>{trans.noDescription}</em>
					)}
				</p>
				<p>
					{trans.latitude(location.coordinates.latitude)}
					<br />
					{trans.longitude(location.coordinates.longitude)}
					<br />
					{location.coordinates.latitude}{" "}
					{location.coordinates.longitude}
					<br />
					{coordinatesToDMS([
						location.coordinates.longitude,
						location.coordinates.latitude,
					])}
				</p>
			</div>
			{id ? (
				<ButtonGroup
					style={{
						width: "fit-content",
					}}
				>
					<LinkContainer to={locationEditPath(id)}>
						<Button href="#">{trans.editLabel}</Button>
					</LinkContainer>
					<Button
						variant="danger"
						onClick={() => {
							// noop for now
						}}
					>
						{trans.deleteLabel}
					</Button>
				</ButtonGroup>
			) : null}
			<DisplayedMap initialView={initialView} icons={icons} />
		</PageContainer>
	)
}

export default LocationView
