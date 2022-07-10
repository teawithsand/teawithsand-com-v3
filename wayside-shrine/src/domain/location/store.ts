import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"
import { GLOBAL_WEB_KEYED_LOCKS } from "tws-common/lang/lock/keyed/WebKeyedLocks"
import { TimestampMs } from "tws-common/lang/time/Timestamp"
import { claimId, NS_STORE, NS_WEB_LOCK } from "tws-common/misc/GlobalIDManager"

export type LocationData = {
	name: string
	description: string
	timestamp: TimestampMs
	coordinates: {
		latitude: number
		longitude: number
	}
}

export type LoadedLocationData = {
	id: string
	data: LocationData
}

export const LOCATION_DATA_STORE =
	LocalForageKeyValueStore.simpleIDB<LocationData>(
		claimId(NS_STORE, "wayside-shrines/locations"),
	)

export const LOCATION_DATA_LOCK = GLOBAL_WEB_KEYED_LOCKS.getRWLock(
	claimId(NS_WEB_LOCK, "wayside-shrines/locations-lock"),
	{},
)

export const useLocationDataStore = () => LOCATION_DATA_STORE
export const useLocationDataLock = () => LOCATION_DATA_LOCK
