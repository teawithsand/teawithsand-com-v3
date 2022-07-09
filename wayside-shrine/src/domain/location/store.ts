import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore";
import { TimestampMs } from "tws-common/lang/time/Timestamp";
import { claimId, NS_STORE } from "tws-common/misc/GlobalIDManager";


export type LocationData = {
	name: string
	timestamp: TimestampMs
	coordinates: {
		latitude: number
		longitude: number
	}
}

export const LOCATION_DATA_STORE = LocalForageKeyValueStore.simpleIDB<LocationData>(
	claimId(NS_STORE, "wayside-shrines/locations"),
)