import { ABOOK_FILE_STORE_LOCK_ADAPTER } from "@app/domain/abook/ABookLock"
import { ABookFileMetadata } from "@app/domain/abook/typedef"

import KeyValueObjectFileStore from "tws-common/file/ofs/KeyValueObjectFileStore"
import { PrefixObjectFileStore } from "tws-common/file/ofs/ObjectFileStore"
import LocalForageKeyValueStore from "tws-common/keyvalue/LocalForageKeyValueStore"
import KeyValueWALStore from "tws-common/lang/wal/KeyValueWALStore"
import { claimId, NS_STORE } from "tws-common/misc/GlobalIDManager"

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
		ABOOK_FILE_STORE_LOCK_ADAPTER,
	)
