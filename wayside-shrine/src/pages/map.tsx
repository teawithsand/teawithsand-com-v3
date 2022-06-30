import PageContainer from "@app/components/layout/PageContainer"
import React, { useEffect } from "react"

import { Tile as TileLayer } from "ol/layer"
import Map from "ol/Map"
import { OSM } from "ol/source"
import View from "ol/View"

import useUniqueId from "tws-common/react/hook/useUniqueId"
import styled from "styled-components"

const MapContainer = styled.div`
	width: 100%;
	height: 75vh;
`

const MapPage = () => {
	const id = useUniqueId()
	useEffect(() => {
		const map = new Map({
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
			target: id,
			view: new View({
				center: [0, 0],
				zoom: 2,
			}),
		})

		return () => {
			map.dispose()
		}
	}, [])
	return (
		<PageContainer>
			<main>
				<MapContainer id={id}></MapContainer>
			</main>
		</PageContainer>
	)
}

export default MapPage
