import { ABookData } from "@app/domain/abook/ABookStore"

import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"
import { claimId, NS_STORE } from "tws-common/misc/GlobalIDManager"

export const ABOOK_DATA_STORE = LocalForageKeyValueStore.simple<ABookData>(
	claimId(NS_STORE, "palm-abooks-pwa/abookMetadata"),
)
export const useABookDataStore = () => ABOOK_DATA_STORE
