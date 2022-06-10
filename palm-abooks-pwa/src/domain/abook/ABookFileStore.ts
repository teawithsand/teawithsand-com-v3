import KeyValueObjectFileStore from "tws-common/file/ofs/KeyValueObjectFileStore"
import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"

import KeyValueWALStore from "tws-common/lang/wal/KeyValueWALStore"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"

export type ABookFileMetadata = {
	disposition: "playable"
	metadata: MetadataLoadingResult | null
}

export const ABOOK_FILE_STORE = new KeyValueObjectFileStore<ABookFileMetadata>(
	LocalForageKeyValueStore.simple("abookFiles"),
	LocalForageKeyValueStore.simple("abookFilesMetadata"),
	new KeyValueWALStore(LocalForageKeyValueStore.simple("abookFilesWAL")),
)

export const useAbookFileStore = () => ABOOK_FILE_STORE
