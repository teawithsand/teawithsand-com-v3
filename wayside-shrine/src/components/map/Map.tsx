import { Collection, Feature } from "ol";
import { Control, defaults as defaultControls, ZoomToExtent } from "ol/control";
import { boundingExtent } from "ol/extent";
import { Point } from "ol/geom";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import OLMap from "ol/Map";
import { fromLonLat as innerFromLonLat } from "ol/proj";
import { OSM, Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import View from "ol/View";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";



import useUniqueId from "tws-common/react/hook/useUniqueId";


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

export type MapView =
	| {
			type: "point"
			coordinates: Coordinates
			zoom?: number
	  }
	| {
			type: "extent"
			extent: Extent
			zoom?: number
	  }

const DEFAULT_ZOOM = 2

const centerMap = (map: OLMap, center: MapView) => {
	if (center.type === "point") {
		map.getView().fit(boundingExtent([center.coordinates]))
		map.getView().setZoom(center.zoom ?? DEFAULT_ZOOM)
	} else if (center.type === "extent") {
		map.getView().fit(center.extent)
	} else {
		throw new Error("unreachable code")
	}
}

const Map = (props: {
	initialView?: MapView
	zoomToExtentButton?: Extent
	icons?: MapIcon[]
}) => {
	const center = props.initialView ?? {
		type: "point",
		coordinates: [0, 0],
		zoom: DEFAULT_ZOOM,
	}
	const extentToZoom = props.zoomToExtentButton ?? null

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

	const [map, setMap] = useState<OLMap | null>(null)

	const iconsLayers = useMemo(
		() =>
			icons.map(icon => {
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
		[icons],
	)

	const currentIconsLayer = useRef<VectorLayer<VectorSource>[]>([])

	const id = useUniqueId()
	useEffect(() => {
		// set some defaults for center here
		// but we will center programmatically with center function anyway
		const view =
			center.type === "point"
				? {
						center: center.coordinates,
						zoom: center.zoom ?? DEFAULT_ZOOM,
				  }
				: {
						center: [0, 0],
						zoom: DEFAULT_ZOOM,
				  }

		const map = new OLMap({
			controls: new Collection([]),
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
			target: id,
			view: new View(view),
		})

		setMap(map)

		return () => {
			map.dispose()
		}
	}, [])

	useEffect(() => {
		if (map) {
			centerMap(map, center)
		}
	}, [map, center])

	useEffect(() => {
		if (map) {
			if (currentIconsLayer.current.length > 0) {
				for (const layer of currentIconsLayer.current) {
					map.getLayers().remove(layer)
				}
			}
			for (const layer of iconsLayers) {
				map.getLayers().push(layer)
			}
			currentIconsLayer.current = iconsLayers
		}
	}, [map, iconsLayers])

	useEffect(() => {
		if (map) {
			map.getControls().clear()

			{
				const button = document.createElement("button")
				button.innerText = "📌" // the best unicode icon I was able to find

				button.addEventListener(
					"click",
					() => centerMap(map, center),
					false,
				)

				const element = document.createElement("div")
				element.style.top = "calc(5.5em)"
				element.style.left = ".5em"
				element.className = "rotate-north ol-unselectable ol-control"
				element.appendChild(button)

				const CenterMapControl = new Control({
					element: element,
				})
				map.addControl(CenterMapControl)
			}

			map.getControls().extend(
				(extentToZoom
					? defaultControls().extend([
							new ZoomToExtent({
								extent: extentToZoom,
							}),
					  ])
					: defaultControls()
				).getArray(),
			)
		}
	}, [map, extentToZoom])

	return <MapContainer id={id}></MapContainer>
}
export default Map