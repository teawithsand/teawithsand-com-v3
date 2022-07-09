import React, { useEffect, useState } from "react"
import styled from "styled-components"

import { useAppTranslationSelector } from "@app/trans/AppTranslation"

import { getNowTimestamp, TimestampMs } from "tws-common/lang/time/Timestamp"
import { Table } from "tws-common/ui"
import { GeolocationErrorCode } from "tws-common/webapi/geolocation"

const ErrorText = styled.span`
	color: red;
	font-weight: bold;
`

const BoldText = styled.span`
	font-weight: bold;
`

const LocationCurrentDisplay = (props: {
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

	const ago = Math.max(0, Math.round((nowTs - lastUpdate) / 1000))
	if (!position) {
		return (
			<div>
				<p>{trans.noPosition(lastUpdate, ago)}</p>
				<p>
					{error && (
						<ErrorText>
							{trans.explainGeolocationErrorCode(error)}
						</ErrorText>
					)}
				</p>
			</div>
		)
	}

	return (
		<section>
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
							<td>
								<BoldText>{trans.errorLabel}</BoldText>
							</td>
							<td>
								<ErrorText>
									{trans.explainGeolocationErrorCode(error)}
								</ErrorText>
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</section>
	)
}

export default LocationCurrentDisplay
