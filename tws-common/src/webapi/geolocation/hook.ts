import { useEffect, useState } from "react"
import {
	getNowPerformanceTimestamp,
	PerformanceTimestampMs,
} from "tws-common/lang/time/Timestamp"
import { generateUUID } from "tws-common/lang/uuid"
import { useRunId } from "tws-common/react/hook/useRunId"
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
	const [runId, restart] = useRunId()

	useEffect(() => {
		setPosition(null)
		setError(null)
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
		restart,
	}
}
