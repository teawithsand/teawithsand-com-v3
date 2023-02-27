import { SyncId } from "tws-common/redux/sync/id"
import { Synchronizer } from "tws-common/redux/sync/synchronizer"

/**
 * Store, which stores all IDs, which *were already* synchronized.
 * In other words: each synchronization updates these.
 */
export interface SyncedIdStore {
	[key: string]: SyncId
}

/**
 * Adapter, capable of getting/setting sync store for given store.
 */
export interface SyncedStoreAdapter<S, H extends SyncedIdStore> {
	getSyncedIdStore(state: S): Readonly<H>
	setSyncedIdStore(state: S, handler: H): S
}

/**
 * Wraps some reducer, so action syncing works.
 */
export const wrapReducerForSync = <S, A, H extends SyncedIdStore>(
	reducer: (state: S | undefined, action: A) => S,
	adapter: SyncedStoreAdapter<S, H>,
	synchronizers: Synchronizer<S, A>[],
): ((state: S | undefined, action: A) => S) => {
	return (state, action) => {
		state = reducer(state, action) // call inner reducer
		let syncHandler = adapter.getSyncedIdStore(state)

		for (const s of synchronizers) {
			const id = s.getId(state)
			if (id === undefined || syncHandler[s.name] !== id) {
				const res = s.doSync(state)
				if (res.type === "state") {
					state = res.state
				} else {
					for (const a of res.actions) {
						state = reducer(state, a)
					}
				}
				state = adapter.setSyncedIdStore(state, {
					...syncHandler,
					[s.name]: id,
				})
				syncHandler = adapter.getSyncedIdStore(state)
			}
		}

		return state
	}
}
