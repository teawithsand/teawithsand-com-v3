import { Feature } from "ol"
import { defaults as defaultControls, ZoomToExtent } from "ol/control"
import { Point } from "ol/geom"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"
import OLMap from "ol/Map"
import { fromLonLat as innerFromLonLat } from "ol/proj"
import { OSM, Vector as VectorSource } from "ol/source"
import { Icon, Style } from "ol/style"
import View from "ol/View"
import React, { useEffect, useMemo } from "react"
import styled from "styled-components"

import useUniqueId from "tws-common/react/hook/useUniqueId"


/**
 * Format is: longitude first, then latitude
 */
export const fromLonLat = (coords: [number, number]): Coordinates =>
	innerFromLonLat(coords) as Coordinates

export type MapIconLocation = {
	coordinates: Coordinates
	name: string
}

export type Coordinates = [number, number]
export type Extent = [number, number, number, number]

const MapContainer = styled.div`
	width: 100%;
	height: 75vh;
`

export type MapIconDisplay = {
	// url to icon image(can be base64/object url ofc)
	src: string
	anchor: [0.5, 46]
	anchorXUnits: "fraction"
	anchorYUnits: "pixels"
}

export type MapIcon = {
	locations: MapIconLocation[]
	display: MapIconDisplay
}

export type MapInitialView =
	| {
			type: "point"
			coordinates: Coordinates
			zoom?: number
	  }
	| {
			type: "extent"
			extent: Extent
	  }

const Map = (props: {
	initialView?: MapInitialView
	zoomToExtent?: Extent
	icons?: MapIcon[]
}) => {
	const center = props.initialView ?? {
		type: "point",
		coordinates: [0, 0],
		zoom: 2,
	}
	const extent = props.zoomToExtent ?? null

	const icons = useMemo(
		() =>
			(props.icons ?? []).map(icon => ({
				features: icon.locations.map(
					location =>
						new Feature({
							geometry: new Point(location.coordinates),
							name: location.name,
						}),
				),
				display: icon.display,
			})),
		[props.icons],
	)

	const id = useUniqueId()
	useEffect(() => {
		const view =
			center.type === "point"
				? {
						center: center.coordinates,
						zoom: center.zoom ?? 2,
				  }
				: {
						center: [0, 0],
						zoom: 2,
				  }

		const map = new OLMap({
			controls: (() => {
				if (extent) {
					return defaultControls().extend([
						new ZoomToExtent({
							extent: extent,
						}),
					])
				} else {
					return defaultControls()
				}
			})(),
			layers: [
				new TileLayer({
					source: new OSM(),
				}),

				...icons.map(icon => {
					return new VectorLayer({
						source: new VectorSource({
							features: icon.features,
						}),
						style: new Style({
							image: new Icon({
								...icon.display,
							}),
						}),
					})
				}),
			],
			target: id,
			view: new View(view),
		})

		if (center.type === "extent") {
			map.getView().fit(center.extent)
		}

		return () => {
			map.dispose()
		}
	}, [center, extent, icons])
	return <MapContainer id={id}></MapContainer>
}
export default Map
