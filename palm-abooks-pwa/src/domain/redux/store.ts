import {
	combineReducers,
	configureStore,
	createReducer,
} from "@reduxjs/toolkit"
import { useSelector } from "react-redux"

import {
	playlistSynchronizer,
	whatToPlayReducer,
	WhatToPlayState,
} from "@app/domain/redux/reducer"

import { BFRReducer } from "tws-common/player/bfr/reducer"
import { BFRState } from "tws-common/player/bfr/state"
import { SyncedIdStore, wrapReducerForSync } from "tws-common/redux/sync/store"

export type State = {
	whatToPlayState: WhatToPlayState
	bfrState: BFRState
	syncedIdStore: SyncedIdStore
}

const syncedIdStoreReducer = createReducer<SyncedIdStore>({}, () => {
	// noop, it makes combineReducers happy though
})

const innerReducer = combineReducers<State>({
	bfrState: BFRReducer,
	whatToPlayState: whatToPlayReducer,
	syncedIdStore: syncedIdStoreReducer,
})

const finalReducer = wrapReducerForSync(
	innerReducer,
	{
		getSyncedIdStore: (s: State) => s.syncedIdStore,
		setSyncedIdStore: (s: State, st) => ({ ...s, syncedIdStore: st }),
	},
	[playlistSynchronizer],
)

export const createStore = () =>
	configureStore<State>({
		reducer: finalReducer,
		devTools: false,
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				serializableCheck: false,
			}),
	})

/**
 * Wraps useSelector to use with BFR state.
 */
export const useBFRSelector = <T>(selector: (state: BFRState) => T) =>
	useSelector((state: State) => selector(state.bfrState))

export const useWTPSelector = <T>(selector: (state: WhatToPlayState) => T) =>
	useSelector((state: State) => selector(state.whatToPlayState))
