import { SyncId } from "tws-common/redux/sync/id"
import { NamedSyncRoot, SyncRoot } from "tws-common/redux/sync/root"

export type SynchronizerAction<S, A> = (state: S) =>
	| {
			type: "actions"
			actions: A[]
	  }
	| {
			type: "state"
			state: S
	  }

/**
 * Type capable of:
 * 1. Getting some specific id to sync from state
 * 2. Taking some action, if not in sync
 * Also, carries unique name identifier to check which key should be checked for is-in-sync.
 */
export type Synchronizer<S, A> = {
	readonly name: string
	getId(state: S): SyncId | undefined
	doSync: SynchronizerAction<S, A>
}

export const makeActionSynchronizerAction =
	<S, A>(...factories: ((state: S) => A[])[]): SynchronizerAction<S, A> =>
	state => ({
		type: "actions",
		actions: factories.flatMap(f => f(state)),
	})

export const makeSyncRootSynchronizer = <S, A>(
	name: string,
	selector: (state: S) => SyncRoot<unknown> | undefined,
	doSync: SynchronizerAction<S, A>,
): Synchronizer<S, A> => ({
	name,
	getId: (state: S) => selector(state)?.id ?? undefined,
	doSync,
})

export const makeNamedSyncRootSynchronizer = <S, A, N extends string>(
	name: N,
	selector: (state: S) => NamedSyncRoot<unknown, N> | undefined,
	doSync: SynchronizerAction<S, A>,
): Synchronizer<S, A> => ({
	name,
	getId: (state: S) => selector(state)?.id ?? undefined,
	doSync,
})
