import React, { useEffect, useState } from "react"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { getNowTimestamp, TimestampMs } from "tws-common/lang/time/Timestamp"
import { Table } from "tws-common/ui"
import { GeolocationErrorCode } from "tws-common/webapi/geolocation"

const LocationDisplay = (props: {
	lastUpdate: TimestampMs
	position: {
		latitude: number
		longitude: number
		accuracy: number
	} | null
	error?: GeolocationErrorCode | undefined | null
}) => {
	const { lastUpdate, position, error } = props

	const [nowTs, setNowTs] = useState(getNowTimestamp())

	useEffect(() => {
		const handle = setInterval(() => {
			setNowTs(getNowTimestamp())
		}, 1000)

		return () => {
			clearInterval(handle)
		}
	}, [])

	const trans = useAppTranslationSelector(s => s.location.display)

	if (!position) {
		return (
			<div>
				No position. Last update:{" "}
				{new Date(lastUpdate).toLocaleString("pl-PL")}
			</div>
		)
	}

	const ago = Math.max(0, Math.round((nowTs - lastUpdate) / 1000))

	return (
		<Table striped hover bordered>
			<tbody>
				<tr>
					<td>{trans.latitudeLabel}</td>
					<td>{position.latitude}</td>
				</tr>
				<tr>
					<td>{trans.longitudeLabel}</td>
					<td>{position.longitude}</td>
				</tr>
				<tr>
					<td>{trans.coordinatesLabel}</td>
					<td>
						{position.latitude} {position.longitude}
					</td>
				</tr>
				<tr>
					<td>{trans.accuracyLabel}</td>
					<td>
						{trans.accuracyRadius(
							position.accuracy,
							position.accuracy > 20,
						)}
					</td>
				</tr>
				<tr>
					<td>{trans.lastUpdateLabel}</td>
					<td>{trans.lastUpdate(lastUpdate)}</td>
				</tr>
				{error && (
					<tr>
						<td>Error</td>
						<td>{trans.explainGeolocationErrorCode(error)}</td>
					</tr>
				)}
			</tbody>
		</Table>
	)
}

export default LocationDisplay
