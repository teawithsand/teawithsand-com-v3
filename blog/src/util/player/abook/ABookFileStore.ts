import KeyValueObjectFileStore from "@app/util/file/ofs/KeyValueObjectFileStore"
import LocalForageKeyValueStore from "@app/util/keyvalue/LocalForageKeyValueStore"

export const ABOOK_FILE_STORE = new KeyValueObjectFileStore(
	LocalForageKeyValueStore.simple("abookFiles"),
)
