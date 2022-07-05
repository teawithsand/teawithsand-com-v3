import { Tile as TileLayer } from "ol/layer"
import OLMap from "ol/Map"
import { OSM } from "ol/source"
import View from "ol/View"
import React, { useEffect } from "react"
import styled from "styled-components"

import useUniqueId from "tws-common/react/hook/useUniqueId"

const MapContainer = styled.div`
	width: 100%;
	height: 75vh;
`

const Map = (props: { center: [number, number] }) => {
	const { center } = props
	const id = useUniqueId()
	useEffect(() => {
		const map = new OLMap({
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
			target: id,
			view: new View({
				center,
				zoom: 2,
			}),
		})

		return () => {
			map.dispose()
		}
	}, [center])
	return <MapContainer id={id}></MapContainer>
}
export default Map
