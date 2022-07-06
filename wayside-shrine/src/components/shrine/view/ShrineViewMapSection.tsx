import React from "react"
import styled from "styled-components"

import Map, { fromLonLat } from "@app/components/map/Map"
import { ShrineViewSectionHeader } from "@app/components/shrine/view/ShrineViewSection"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Button, ButtonGroup, ButtonToolbar } from "tws-common/ui"

const MapSection = styled.section``
const MapSectionHeader = ShrineViewSectionHeader

const OptionsButtonGroup = styled(ButtonGroup)`
	margin-bottom: 1rem;
`

// eslint-disable-next-line react/display-name
const ShrineViewMapSection = React.forwardRef(
	(props: { coordinates: [number, number] }, ref) => {
		const { coordinates } = props
		const trans = useAppTranslationSelector(s => s.shrine.view)

		return (
			<MapSection ref={ref as any}>
				<MapSectionHeader>
					<h3>{trans.mapHeader}</h3>
					<p>{props.coordinates.map(v => v.toString()).join(" ")}</p>
					<OptionsButtonGroup>
						<Button
							href={`https://www.google.com/maps?q=${encodeURIComponent(
								[...props.coordinates]
									.reverse()
									.map(v => v.toString())
									.join(","),
							)}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							Google Maps
						</Button>
						<Button
							href={`https://www.openstreetmap.org/#map=10/${coordinates[0]}/${coordinates[1]}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							OSM
						</Button>
					</OptionsButtonGroup>
				</MapSectionHeader>

				<Map
					initialView={{
						type: "point",
						zoom: 10,
						coordinates: fromLonLat(coordinates),
					}}
					icons={[
						{
							display: {
								src: "https://openlayers.org/en/latest/examples/data/icon.png",
								anchor: [0.5, 46],
								anchorXUnits: "fraction",
								anchorYUnits: "pixels",
							},
							locations: [
								{
									name: "Object",
									coordinates: fromLonLat(coordinates),
								},
							],
						},
					]}
				/>
			</MapSection>
		)
	},
)

export default ShrineViewMapSection
