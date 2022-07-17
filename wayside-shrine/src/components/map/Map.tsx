import { Collection, Feature } from "ol"
import { Control, defaults as defaultControls, ZoomToExtent } from "ol/control"
import { boundingExtent } from "ol/extent"
import { Point } from "ol/geom"
import Circle from "ol/geom/Circle"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"
import OLMap from "ol/Map"
import { fromLonLat as innerFromLonLat } from "ol/proj"
import { OSM, Vector as VectorSource } from "ol/source"
import {
	Circle as CircleStyle,
	Icon as IconStyle,
	Stroke as StrokeStyle,
	Style,
} from "ol/style"
import View from "ol/View"
import React, { useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"
import { isSSR } from "tws-common/ssr"

// https://stackoverflow.com/questions/37893131/how-to-convert-lat-long-from-decimal-degrees-to-dms-format
const toDegreesMinutesAndSeconds = (coordinate: number): string => {
	const absolute = Math.abs(coordinate)
	const degrees = Math.floor(absolute)
	const minutesNotTruncated = (absolute - degrees) * 60
	const minutes = Math.floor(minutesNotTruncated)
	const seconds = Math.floor((minutesNotTruncated - minutes) * 60)

	return degrees + "°" + minutes + "'" + seconds + '"'
}

export function coordinatesToDMS([lon, lat]: [number, number]) {
	const latitude = toDegreesMinutesAndSeconds(lat)
	const latitudeCardinal = lat >= 0 ? "N" : "S"

	const longitude = toDegreesMinutesAndSeconds(lon)
	const longitudeCardinal = lon >= 0 ? "E" : "W"

	return latitude + latitudeCardinal + "\n" + longitude + longitudeCardinal
}

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
	style?: React.CSSProperties
	className?: string
}) => {
	const center = props.initialView ?? {
		type: "point",
		coordinates: [0, 0],
		zoom: DEFAULT_ZOOM,
	}
	const extentToZoom = props.zoomToExtentButton ?? null

	const icons = useMemo(() => {
		// This is required, since it looks like react calls useMemo on SSR renders and is not able to cache Feature and stuff
		if (isSSR()) return []

		return (props.icons ?? []).map(icon => ({
			features: icon.locations.map(
				location =>
					new Feature({
						geometry: new Point(location.coordinates),
						name: location.name,
					}),
			),
			display: icon.display,
		}))
	}, [props.icons])

	const [map, setMap] = useState<OLMap | null>(null)

	const iconsLayers = useMemo(() => {
		// This is required, since it looks like react calls useMemo on SSR renders and is not able to cache Feature and stuff
		if (isSSR()) return []

		return [
			...icons.map(icon => {
				return new VectorLayer({
					source: new VectorSource({
						features: icon.features,
					}),
					style: new Style({
						image: new IconStyle({
							...icon.display,
						}),
					}),
				})
			}),
			new VectorLayer({
				source: new VectorSource({
					features: [new Feature(new Circle([5e6, 7e6], 1e6))],
				}),
				style: new Style({
					image: new CircleStyle({
						radius: 5,
						stroke: new StrokeStyle({ color: "red", width: 1 }),
					}),
				}),
			}),
		]
	}, [icons])

	const currentIconsLayer = useRef<VectorLayer<VectorSource>[]>([])

	const [ref, setRef] = useState<HTMLDivElement | null>(null)
	useEffect(() => {
		if (!ref) return

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
			target: ref,
			view: new View(view),
		})

		setMap(map)

		return () => {
			map.dispose()
		}
	}, [ref])

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

	return (
		<MapContainer
			ref={setRef}
			className={props.className}
			style={props.style}
		></MapContainer>
	)
}

export default wrapNoSSR(Map)
