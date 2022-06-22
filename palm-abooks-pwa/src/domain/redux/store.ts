import {
	combineReducers,
	configureStore,
	createReducer,
} from "@reduxjs/toolkit"
import { useSelector } from "react-redux"

import { MBFRState } from "@app/domain/bfr/state"
import { playerUiReducer, PlayerUIState } from "@app/domain/redux/playerUi"
import {
	playlistSynchronizer,
	whatToPlayReducer,
	WhatToPlayState,
} from "@app/domain/wtp/reducer"

import { createBFRReducer } from "tws-common/player/bfr/reducer"
import { BFRState } from "tws-common/player/bfr/state"
import { SyncedIdStore, wrapReducerForSync } from "tws-common/redux/sync/store"

export type State = {
	whatToPlayState: WhatToPlayState
	bfrState: MBFRState
	syncedIdStore: SyncedIdStore
	playerUi: PlayerUIState
}

const syncedIdStoreReducer = createReducer<SyncedIdStore>({}, () => {
	// noop, it makes combineReducers happy though
})

const innerReducer = combineReducers<State>({
	bfrState: createBFRReducer(),
	whatToPlayState: whatToPlayReducer,
	syncedIdStore: syncedIdStoreReducer,
	playerUi: playerUiReducer,
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
			}) as unknown as any, // this is ok but TS complaints for some reason
	})

/**
 * Wraps useSelector to use with BFR state.
 */
export const useBFRSelector = <T>(selector: (state: BFRState) => T) =>
	useSelector((state: State) => selector(state.bfrState))

export const useWTPSelector = <T>(selector: (state: WhatToPlayState) => T) =>
	useSelector((state: State) => selector(state.whatToPlayState))

export const usePlayerUiSelector = <T>(
	selector: (state: PlayerUIState) => T,
) => useSelector((state: State) => selector(state.playerUi))
