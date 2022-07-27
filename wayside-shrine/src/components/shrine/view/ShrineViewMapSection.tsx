import { graphql, useStaticQuery } from "gatsby"
import { getSrc } from "gatsby-plugin-image"
import React, { useMemo } from "react"
import styled from "styled-components"

import Map, { fromLonLat, MapIcon, MapView } from "@app/components/map/Map"
import { ShrineViewSectionHeader } from "@app/components/shrine/view/ShrineViewSection"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { Button, ButtonGroup } from "tws-common/ui"

const MapSection = styled.section``
const MapSectionHeader = ShrineViewSectionHeader

const OptionsButtonGroup = styled(ButtonGroup)`
	margin-bottom: 1rem;
`

// eslint-disable-next-line react/display-name
const ShrineViewMapSection = React.forwardRef(
	(props: { coordinates: [number, number] }, ref) => {
		const iconData: Queries.MapLocationIconQuery = useStaticQuery(graphql`
			query MapLocationIcon {
				allFile(
					filter: {
						sourceInstanceName: { eq: "images" }
						name: { eq: "location" }
					}
				) {
					nodes {
						childImageSharp {
							gatsbyImageData(
								layout: FIXED
								backgroundColor: "transparent"
								formats: [PNG]
								placeholder: TRACED_SVG
								height: 48
							)
						}
					}
				}
			}
		`)

		const iconSource = iconData.allFile.nodes[0].childImageSharp
			?.gatsbyImageData
			? getSrc(
					iconData.allFile.nodes[0].childImageSharp?.gatsbyImageData,
			  ) ?? ""
			: ""

		const { coordinates } = props
		const trans = useAppTranslationSelector(s => s.shrine.view)

		const initialView: MapView = useMemo(
			() => ({
				type: "point",
				zoom: 10,
				coordinates: fromLonLat(coordinates),
			}),
			[coordinates],
		)

		const icons: MapIcon[] = useMemo(
			() => [
				{
					display: {
						src: iconSource,
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
			],
			[coordinates],
		)

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
							Open Street Maps
						</Button>
					</OptionsButtonGroup>
				</MapSectionHeader>

				<Map initialView={initialView} icons={icons} />
			</MapSection>
		)
	},
)

export default ShrineViewMapSection
