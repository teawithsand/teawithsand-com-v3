import { SyncID } from "tws-common/redux/sync/id"
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

export type Synchronizer<S, A> = {
	readonly name: string
	getId(state: S): SyncID | undefined
	doSync: SynchronizerAction<S, A>
}

export const makeSimpleSynchronizerAction =
	<S, A>(...actions: A[]): SynchronizerAction<S, A> =>
	() => ({
		type: "actions",
		actions: actions,
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
