import { ABookData } from "@app/domain/abook/ABookStore"

import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"

export const ABOOK_DATA_STORE =
	LocalForageKeyValueStore.simple<ABookData>("abookMetadata")
export const useABookDataStore = () => ABOOK_DATA_STORE
