import { ABookFileMetadata } from "@app/domain/abook/ABookStore"

import KeyValueObjectFileStore from "tws-common/file/ofs/KeyValueObjectFileStore"
import { PrefixObjectFileStore } from "tws-common/file/ofs/ObjectFileStore"
import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"
import { GLOBAL_WEB_KEYED_LOCKS } from "tws-common/lang/lock/keyed/WebKeyedLocks"
import KeyValueWALStore from "tws-common/lang/wal/KeyValueWALStore"
import { claimId, NS_STORE, NS_WEB_LOCK } from "tws-common/misc/GlobalIDManager"

export const ABOOK_FILE_STORE: PrefixObjectFileStore<ABookFileMetadata> =
	new KeyValueObjectFileStore<ABookFileMetadata>(
		LocalForageKeyValueStore.simple(
			claimId(NS_STORE, "palm-abooks-pwa/abook-files"),
		),
		LocalForageKeyValueStore.simple(
			claimId(NS_STORE, "palm-abooks-pwa/abook-files-metadata"),
		),
		new KeyValueWALStore(
			LocalForageKeyValueStore.simple(
				claimId(NS_STORE, "palm-abooks-pwa/abook-files-wal"),
			),
		),
		GLOBAL_WEB_KEYED_LOCKS.getRWLockAdapter(
			claimId(NS_WEB_LOCK, "palm-abooks-pwa/abook-files-lock"),
		),
	)

export const useAbookFileStore = () => ABOOK_FILE_STORE
