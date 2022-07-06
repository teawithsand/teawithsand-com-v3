import React from "react"
import styled from "styled-components"

import Map, { fromLonLat } from "@app/components/map/Map"
import { ShrineViewSectionHeader } from "@app/components/shrine/view/ShrineViewSection"
import { useAppTranslationSelector } from "@app/trans/AppTranslation"

const MapSection = styled.section``
const MapSectionHeader = ShrineViewSectionHeader

// eslint-disable-next-line react/display-name
const ShrineViewMapSection = React.forwardRef(
	(props: { coordinates: [number, number] }, ref) => {
		const { coordinates } = props
		const trans = useAppTranslationSelector(s => s.shrine.view)

		return (
			<MapSection ref={ref as any}>
				<MapSectionHeader>
					<h3>{trans.mapHeader}</h3>
				</MapSectionHeader>

				<Map initialView={{
					type: "point",
					zoom: 10,
					coordinates: fromLonLat(coordinates),
				}} />
			</MapSection>
		)
	},
)

export default ShrineViewMapSection
