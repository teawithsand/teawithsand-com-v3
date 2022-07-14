import React from "react"
import styled from "styled-components"

import { LoadedLocationData } from "@app/domain/location/store"
import { locationMenuPath } from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Button, ButtonGroup, Table } from "tws-common/ui"
import LinkContainer from "tws-common/ui/LinkContainer"

const NoLocations = styled.div`
	text-align: center;

	display: grid;
	grid-auto-flow: row;
	grid-auto-rows: auto;
	grid-template-columns: 1fr;
	gap: 1rem;
`

const LocationList = (props: { locations: LoadedLocationData[] }) => {
	const { locations } = props

	const innerLocations = locations.map(l => l.data)

	const trans = useAppTranslationSelector(s => s.location.list)

	if (locations.length === 0) {
		return (
			<NoLocations>
				<h1>{trans.noLocationsTitle}</h1>
				<LinkContainer to={locationMenuPath}>
					<Button href="#">{trans.noLocationsGoToMenu}</Button>
				</LinkContainer>
			</NoLocations>
		)
	}

	return (
		<Table striped hover bordered>
			<thead>
				<tr>
					<td>{trans.ordinalNumber}</td>
					<td>{trans.name}</td>
					<td>{trans.date}</td>
					<td>{trans.coordinates}</td>
					<td>{trans.actions.label}</td>
				</tr>
			</thead>
			<tbody>
				{innerLocations.map((l, i) => (
					<tr key={i}>
						<td>{i + 1}</td>
						<td>{l.name}</td>
						<td>{new Date(l.timestamp).toLocaleString("pl-PL")}</td>
						<td>
							{l.coordinates.latitude}
							<br />
							{l.coordinates.longitude}
						</td>
						<td>
							<ButtonGroup>
								<LinkContainer to="/">
									<Button href="#">
										{trans.actions.view}
									</Button>
								</LinkContainer>
								<Button
									onClick={() => {
										// noop for now
									}}
									variant="danger"
								>
									{trans.actions.delete}
								</Button>
							</ButtonGroup>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	)
}

export default LocationList
