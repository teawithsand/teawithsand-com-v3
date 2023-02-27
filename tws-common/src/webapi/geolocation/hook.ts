import { useEffect, useState } from "react"
import {
	getNowPerformanceTimestamp,
	getNowTimestamp,
	PerformanceTimestampMs,
	TimestampMs,
} from "tws-common/lang/time/Timestamp"
import { useRunId } from "tws-common/react/hook/useRunId"
import {
	GeolocationError,
	GeolocationHelper,
	GeolocationPosition,
	ReadPositionOptions,
} from "tws-common/webapi/geolocation"

export const useWatchGeolocation = (
	config: ReadPositionOptions,
	watchOptions?: {
		suspense?: boolean
	},
) => {
	const suspense = watchOptions?.suspense ?? false
	const [lastUpdatePerformanceTs, setLastUpdatePerformanceTs] =
		useState<PerformanceTimestampMs>(getNowPerformanceTimestamp())
	const [lastUpdateTs, setLastUpdateTs] = useState<TimestampMs>(
		getNowTimestamp(),
	)
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

		setLastUpdatePerformanceTs(getNowPerformanceTimestamp())
		setLastUpdateTs(getNowTimestamp())

		return () => {
			claim.close()
		}
	}, [config, runId])

	if (suspense && error) {
		throw error
	}

	return {
		position,
		error,
		lastUpdatePerformanceTs,
		lastUpdateTs,
		restart,
	}
}
