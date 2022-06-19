import { ABookFileMetadata } from "@app/domain/abook/ABookStore"

import KeyValueObjectFileStore from "tws-common/file/ofs/KeyValueObjectFileStore"
import { PrefixObjectFileStore } from "tws-common/file/ofs/ObjectFileStore"
import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"
import { GLOBAL_WEB_KEYED_LOCKS } from "tws-common/lang/lock/keyed/WebKeyedLocks"
import KeyValueWALStore from "tws-common/lang/wal/KeyValueWALStore"

export const ABOOK_FILE_STORE: PrefixObjectFileStore<ABookFileMetadata> =
	new KeyValueObjectFileStore<ABookFileMetadata>(
		LocalForageKeyValueStore.simple("abookFiles"),
		LocalForageKeyValueStore.simple("abookFilesMetadata"),
		new KeyValueWALStore(LocalForageKeyValueStore.simple("abookFilesWAL")),
		GLOBAL_WEB_KEYED_LOCKS.getRWLockAdapter(
			"app/palm-abooks-pwa/ABOOK_FILE_STORE",
		),
	)

export const useAbookFileStore = () => ABOOK_FILE_STORE
