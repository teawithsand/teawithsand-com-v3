import { ABookData } from "@app/domain/abook/typedef"
import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"
import { claimId, NS_STORE } from "tws-common/misc/GlobalIDManager"

export const ABOOK_DATA_STORE = LocalForageKeyValueStore.simple<ABookData>(
	claimId(NS_STORE, "palm-abooks-pwa/abookMetadata"),
)
