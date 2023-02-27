export type GlobalIDNamespace = string & { readonly id: unique symbol }

export const NS_WEB_LOCK: GlobalIDNamespace = "WEB_LOCK" as GlobalIDNamespace
export const NS_STORE: GlobalIDNamespace = "STORE" as GlobalIDNamespace
export const NS_REDUX_ACTION: GlobalIDNamespace =
	"REDUX_ACTION" as GlobalIDNamespace
export const NS_REDUX_ACTION_PREFIX: GlobalIDNamespace =
	"REDUX_PREFIX" as GlobalIDNamespace
export const NS_LOG_TAG: GlobalIDNamespace = "LOG_TAG" as GlobalIDNamespace
export const NS_SYNC_ROOT: GlobalIDNamespace = "SR_NAME" as GlobalIDNamespace
export const NS_REACT_QUERY: GlobalIDNamespace = "RQ_NAME" as GlobalIDNamespace
export const NS_DND_ID: GlobalIDNamespace = "DND_TG" as GlobalIDNamespace

class GlobalIDManagerImpl {
	private claimedIds: Map<GlobalIDNamespace, Set<string>> | null = new Map()

	/**
	 * Actually, this is useful for testing only.
	 * Removes all previously registered ids.
	 *
	 * Also, reenables GlobalIDManager
	 */
	reset = () => {
		this.claimedIds = new Map()
	}

	/**
	 * Disables GlobalIDManager.
	 * This is useful sometimes, since this manager does not work with HMR well.
	 */
	disable = () => {
		this.claimedIds = null
	}

	/**
	 * Claims specified id globally.
	 * Throws if ID's already claimed.
	 *
	 * It's used to make sure that things like lock IDs won't collide with each other.
	 *
	 * @returns id provided
	 */
	claimId = <T extends string>(ns: GlobalIDNamespace, id: T): T => {
		if (this.claimedIds === null) return id
		const set = this.claimedIds.get(ns) ?? new Set()

		if (set.has(id)) throw new Error(`ID: ${id} was already claimed`)

		set.add(id)
		this.claimedIds.set(ns, set)

		return id
	}

	/**
	 * Creates claimer, which preforms id claiming for some namespace.
	 */
	claimer =
		<T extends string>(ns: GlobalIDNamespace) =>
		(id: T) =>
			this.claimId(ns, id)
}

export const GlobalIdManager = new GlobalIDManagerImpl()
export const claimId = GlobalIdManager.claimId
export const createIdClaimer = GlobalIdManager.claimer
