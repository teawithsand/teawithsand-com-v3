import KeyValueObjectFileStore from "tws-common/file/ofs/KeyValueObjectFileStore"
import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"

export const ABOOK_FILE_STORE = new KeyValueObjectFileStore(
	LocalForageKeyValueStore.simple("abookFiles"),
)

export const useAbookFileStore = () => ABOOK_FILE_STORE
