import { SyncID } from "tws-common/redux/sync/id"
import { Synchronizer } from "tws-common/redux/sync/synchronizer"

export interface SyncedStore {
	[key: string]: SyncID
}

export interface SyncedStoreAdapter<S, H extends SyncedStore> {
	getSyncHandler(state: S): Readonly<H>
	setSyncHandler(state: S, handler: H): S
}

export const wrapReducer = <S, A, H extends SyncedStore>(
	reducer: (state: S, action: A) => S,
	adapter: SyncedStoreAdapter<S, H>,
	synchronizers: Synchronizer<S, A>[],
): ((state: S, action: A) => S) => {
	return (state, action) => {
		state = reducer(state, action)
		let syncHandler = adapter.getSyncHandler(state)

		for (const s of synchronizers) {
			const id = s.getId(state)
			if (syncHandler[s.name] !== id) {
				const res = s.doSync(state)
				if (res.type === "state") {
					state = res.state
				} else {
					for (const a of res.actions) {
						state = reducer(state, a)
					}
				}
				state = adapter.setSyncHandler(state, {
					...syncHandler,
					[s.name]: id,
				})
				syncHandler = adapter.getSyncHandler(state)
			}
		}
		return state
	}
}
