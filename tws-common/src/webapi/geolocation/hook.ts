import { useEffect, useState } from "react"
import {
	getNowPerformanceTimestamp,
	PerformanceTimestampMs,
} from "tws-common/lang/time/Timestamp"
import { generateUUID } from "tws-common/lang/uuid"
import {
	GeolocationError,
	GeolocationHelper,
	GeolocationPosition,
	ReadPositionOptions,
} from "tws-common/webapi/geolocation"

export const useWatchGeolocation = (config: ReadPositionOptions) => {
	const [lastUpdateTimestamp, setLastUpdateTimestamp] =
		useState<PerformanceTimestampMs>(getNowPerformanceTimestamp())
	const [position, setPosition] = useState<GeolocationPosition | null>(null)
	const [error, setError] = useState<GeolocationError | null>(null)
	const [runId, setRunId] = useState(generateUUID())

	useEffect(() => {
		const claim = GeolocationHelper.createReadClaim(config)

		claim.bus.addSubscriber(e => {
			if (e.type === "error") {
				setError(e.error)
			} else if (e.type === "position") {
				setPosition(e.position)
			}
		})

		setLastUpdateTimestamp(getNowPerformanceTimestamp())

		return () => {
			claim.close()
		}
	}, [config, runId])

	return {
		position,
		error,
		lastUpdateTimestamp,
		restart: () => {
			setRunId(generateUUID())
		},
	}
}
