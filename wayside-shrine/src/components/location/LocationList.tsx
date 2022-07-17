import React, { useMemo } from "react"
import styled from "styled-components"

import { LoadedLocationData } from "@app/domain/location/store"
import { locationMenuPath, locationShowPath } from "@app/paths"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { useDialogManager } from "tws-common/react/components/dialog"
import { useSortHelper } from "tws-common/react/hook/useSortHelper"
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

type LocationSortField = "name" | "date"

const LocationList = (props: { locations: LoadedLocationData[] }) => {
	const { locations: inputLocations } = props

	const { sortField, sortAsc, sortCallback, sortIcon, cacheKey } =
		useSortHelper<LocationSortField>({
			sortField: "date",
			sortAsc: true,
		})

	const rawLocations = useMemo(
		() =>
			inputLocations.map(l => ({
				...l.data,
				id: l.id,
			})),
		[inputLocations],
	)

	const locations = useMemo(() => {
		if (sortField === "name") {
			return [...rawLocations].sort((a, b) =>
				sortAsc
					? a.name.localeCompare(b.name)
					: -a.name.localeCompare(b.name),
			)
		} else if (sortField === "date") {
			return [...rawLocations].sort((a, b) =>
				sortAsc ? a.timestamp - b.timestamp : b.timestamp - a.timestamp,
			)
		} else {
			throw new Error("unreachable code")
		}
	}, cacheKey)

	const dm = useDialogManager()

	const trans = useAppTranslationSelector(s => s.location.list)

	if (inputLocations.length === 0) {
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
					<td onClick={() => sortCallback("name")}>
						{trans.name} {sortIcon("name")}
					</td>
					<td onClick={() => sortCallback("date")}>
						{trans.date} {sortIcon("date")}
					</td>
					<td>{trans.coordinates}</td>
					<td>{trans.actions.label}</td>
				</tr>
			</thead>
			<tbody>
				{locations.map((l, i) => (
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
								<LinkContainer to={locationShowPath(l.id)}>
									<Button href="#">
										{trans.actions.view}
									</Button>
								</LinkContainer>
							</ButtonGroup>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	)
}

export default LocationList
