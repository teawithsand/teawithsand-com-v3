import { GLOBAL_WEB_KEYED_LOCKS } from "tws-common/lang/lock/keyed/WebKeyedLocks";
import { claimId, NS_WEB_LOCK } from "tws-common/misc/GlobalIDManager";

export const ABOOK_FILE_STORE_LOCK_ADAPTER = GLOBAL_WEB_KEYED_LOCKS.getRWLockAdapter(
	claimId(NS_WEB_LOCK, "palm-abooks-pwa/abook-file-store-lock"),
)
export const ABOOK_LOCK_ADAPTER = GLOBAL_WEB_KEYED_LOCKS.getRWLockAdapter(
	claimId(NS_WEB_LOCK, "palm-abooks-pwa/abook-stores-lock"),
)
export const ABOOK_COMPOUND_LOCK_ADAPTER = GLOBAL_WEB_KEYED_LOCKS.getRWLockAdapter(
	claimId(NS_WEB_LOCK, "palm-abooks-pwa/abook-stores-compound-lock"),
)
