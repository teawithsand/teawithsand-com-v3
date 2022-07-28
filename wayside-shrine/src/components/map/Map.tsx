import { Collection, Feature } from "ol"
import { Control, defaults as defaultControls, ZoomToExtent } from "ol/control"
import { boundingExtent } from "ol/extent"
import { Point } from "ol/geom"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"
import OLMap from "ol/Map"
import { fromLonLat as innerFromLonLat } from "ol/proj"
import { OSM, Vector as VectorSource } from "ol/source"
import { Icon as IconStyle, Style } from "ol/style"
import View from "ol/View"
import React, { useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"

import { wrapNoSSR } from "tws-common/react/components/NoSSR"
import {
	BREAKPOINT_SM,
	breakpointMediaDown,
} from "tws-common/react/hook/dimensions/useBreakpoint"
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
	htmlTitle?: string
	hoverText?: string
	onClick?: () => void
}

export type Coordinates = [number, number]
export type Extent = number[]

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

type MapHoverContainerProps = {
	$visible: boolean
	$position: [number, number]
	$text: string
}

const MapHoverContainer = styled.div.attrs<MapHoverContainerProps>(props => ({
	style: {
		display: props.$visible ? "block" : "none",
		top: props.$position[1],
		left: props.$position[0],
	},
}))<MapHoverContainerProps>`
	top: 0;
	left: 0;
	position: absolute;

	background-color: rgba(255, 255, 255, 0.85);
	border: 1px solid rgba(0, 0, 0, 0.25);
	padding: 1rem;
	max-width: 50vw;

	border-radius: 0.25rem;

	@media ${breakpointMediaDown(BREAKPOINT_SM)} {
		max-width: 90vw;
	}

	z-index: 1000;
`

const Map = (props: {
	initialView?: MapView
	zoomToExtentButton?: Extent
	icons?: MapIcon[]
	style?: React.CSSProperties
	className?: string
}) => {
	const [hoverContainerProps, setHoverContainerProps] =
		useState<MapHoverContainerProps>({
			$position: [0, 0],
			$visible: false,
			$text: "",
		})

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
						htmlTitle: location.htmlTitle,
						onClick: location.onClick,
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

			const pointerMoveCallback = function (e: any) {
				const pixel = map.getEventPixel(e.originalEvent)
				const features = map.getFeaturesAtPixel(pixel)

				let feature = null
				for (const f of features) {
					if (f.get("onClick")) {
						feature = f
						break
					}
				}

				const [x, y] = [
					e.originalEvent.clientX,
					e.originalEvent.clientY,
				]

				const target = map.getTarget()
				if (target && typeof target !== "string") {
					target.style.cursor = feature !== null ? "pointer" : ""
					const targetTitle =
						feature !== null ? feature.get("htmlTitle") : ""
					if (target.title !== targetTitle) {
						target.title = targetTitle ?? ""
					}

					if (targetTitle && feature) {
						setHoverContainerProps({
							$visible: true,
							$position: [x + 20, y + 20],
							$text: targetTitle,
						})
					} else {
						setHoverContainerProps({
							$visible: false,
							$position: [0, 0],
							$text: "",
						})
					}
				}
			}
			map.on("pointermove", pointerMoveCallback)

			/*
			const pointerLeaveCallback = () => {
				setHoverContainerProps({
					$visible: false,
					$position: [0, 0],
					$text: "",
				})
			}
			map.on("pointerout", pointerLeaveCallback)
			*/

			const clickCallback = function (e: any) {
				const pixel = map.getEventPixel(e.originalEvent)
				const features = map.getFeaturesAtPixel(pixel)

				for (const f of features) {
					const callback = f.get("onClick")
					if (callback) {
						callback()
						break
					}
				}
			}
			map.on("click", clickCallback)

			return () => {
				map.un("pointermove", pointerMoveCallback)
				map.un("click", clickCallback)
				// map.un("pointerout", pointerLeaveCallback)
			}
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
		<>
			<MapHoverContainer {...hoverContainerProps}>
				{hoverContainerProps.$text}
			</MapHoverContainer>
			<MapContainer
				ref={setRef}
				className={props.className}
				style={props.style}
			></MapContainer>
		</>
	)
}

export default wrapNoSSR(Map)
