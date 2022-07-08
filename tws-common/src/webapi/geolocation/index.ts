import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import { DefaultStickyEventBus } from "tws-common/lang/bus/StickyEventBus"
import BaseError from "tws-common/lang/error"
import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import { isSSR } from "tws-common/ssr"

const LOG_TAG = claimId(NS_LOG_TAG, "tws-common/Geolocation")

export enum GeolocationErrorCode {
	PERMISSION_DENIED = 1,
	POSITION_UNAVAILABLE = 2,
	TIMEOUT = 3,
	NOT_SUPPORTED = 4,
	UNKNOWN = 1234,
}

export class GeolocationError extends BaseError {
	constructor(
		message: string,
		public readonly code: GeolocationErrorCode,
		cause?: any,
	) {
		super(message, cause)
	}
}

const makeGeolocationError = (e: any) => {
	if (e instanceof GeolocationPositionError) {
		const code = explainGeolocationError(e)
		return new GeolocationError("Geolocation claim filed", code, e)
	} else {
		return new GeolocationError(
			"Geolocation claim filed",
			GeolocationErrorCode.UNKNOWN,
			e,
		)
	}
}

// See
// https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates
export type GeolocationPosition = {
	timestamp: number // https://developer.mozilla.org/en-US/docs/Web/API/EpochTimeStamp
	latitude: number // decimal degrees
	longitude: number // decimal degrees
	altitude: number | null // meters relative to sea level
	accuracy: number // +/- value in meters
	altitudeAccuracy: number | null // +/- value in meters
	heading: number | null // degrees from 0 to 359.(9) or NaN
	speed: number | null // meter per second
}

export type GeolocationEvent =
	| {
			type: "initializing"
	  }
	| {
			type: "position"
			position: GeolocationPosition
	  }
	| {
			type: "error"
			error: GeolocationError
	  }

const explainGeolocationError = (
	e: GeolocationPositionError,
): GeolocationErrorCode => {
	const { code } = e
	if (code === 1) {
		return GeolocationErrorCode.PERMISSION_DENIED
	} else if (code === 2) {
		return GeolocationErrorCode.POSITION_UNAVAILABLE
	} else if (code === 3) {
		return GeolocationErrorCode.TIMEOUT
	}
	return GeolocationErrorCode.UNKNOWN
}

export type GeolocationClaim = {
	readonly isClosed: boolean
	bus: StickySubscribable<GeolocationEvent>
	close: () => void
}

const DEFAULT_READ_POSITION_OPTIONS: ReadPositionOptions = {
	enableHighAccuracy: false,
	maximumAge: 0,
	timeout: Infinity,
}

// See
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
// Options parameter
export type ReadPositionOptions = {
	maximumAge: number // in ms; how long backwards cache call is ok; default 0
	timeout: number // in ms; how long for new position(in ms); default Infinity
	enableHighAccuracy: boolean // if true better accuracy but slower, default false
}

class GeolocationHelperImpl {
	private checkSupport = () => {
		return !isSSR() && typeof window.navigator.geolocation !== "undefined"
	}

	public readonly isSupported = this.checkSupport()

	readPosition = async (
		options: Partial<ReadPositionOptions>,
	): Promise<GeolocationPosition> => {
		if (!this.checkSupport()) {
			throw new GeolocationError(
				"Geolocation not supported",
				GeolocationErrorCode.NOT_SUPPORTED,
			)
		}

		const p = new Promise<GeolocationPosition>((resolve, reject) => {
			window.navigator.geolocation.getCurrentPosition(
				e => {
					resolve({
						timestamp: e.timestamp,
						...e.coords,
					})
				},
				reject,
				{
					...DEFAULT_READ_POSITION_OPTIONS,
					...options,
				},
			)
		})

		try {
			return await p
		} catch (e) {
			throw makeGeolocationError(e)
		}
	}

	createReadClaim = (options: ReadPositionOptions): GeolocationClaim => {
		if (!this.checkSupport()) {
			throw new GeolocationError(
				"Geolocation not supported",
				GeolocationErrorCode.NOT_SUPPORTED,
			)
		}

		let isClosed = false

		const bus = new DefaultStickyEventBus<GeolocationEvent>({
			type: "initializing",
		})

		let resolved = false
		let hasError = false
		let handle: number | null = null

		const cleanup = () => {
			isClosed = true
			if (!resolved) {
				LOG.error(
					LOG_TAG,
					"Tried to cleanup geolocation watcher before promise resolved",
				)
			}

			if (handle !== null) {
				window.navigator.geolocation.clearWatch(handle)
				handle = null
			}
		}

		new Promise<void>((resolve, reject) => {
			handle = window.navigator.geolocation.watchPosition(
				e => {
					if (!hasError) {
						bus.emitEvent({
							type: "position",
							position: {
								timestamp: e.timestamp,
								...e.coords,
							},
						})
					}
					if (!resolved) {
						resolved = true

						resolve()
					}
				},
				e => {
					const explained = makeGeolocationError(e)
					LOG.debug(LOG_TAG, "Geolocation error received", explained)

					hasError = true
					if (!resolved) {
						resolved = true
						reject(e)
					}
					bus.emitEvent({
						type: "error",
						error: explained,
					})

					cleanup()
				},
				options,
			)
		})

		return {
			get isClosed() {
				return isClosed
			},
			close: () => {
				cleanup()
			},
			bus,
		}
	}
}

export const GeolocationHelper = new GeolocationHelperImpl()
