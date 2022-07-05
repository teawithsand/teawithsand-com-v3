import {
	combineReducers,
	configureStore,
	createReducer,
} from "@reduxjs/toolkit"
import { useSelector } from "react-redux"

import { MBFRState } from "@app/domain/bfr/state"
import { displayInfoReducer } from "@app/domain/displayInfo/reducer"
import { DisplayInfoState } from "@app/domain/displayInfo/state"
import { playerUiReducer, PlayerUIState } from "@app/domain/redux/playerUi"
import {
	bfrMetadataStateSynchronizer,
	whatToPlayStateSynchronizer,
} from "@app/domain/redux/synchronizers"
import { whatToPlayReducer } from "@app/domain/wtp/reducer"
import { WTPState } from "@app/domain/wtp/state"

import { createBFRReducer } from "tws-common/player/bfr/reducer"
import { BFRState } from "tws-common/player/bfr/state"
import { SyncedIdStore, wrapReducerForSync } from "tws-common/redux/sync/store"
import { flashMessageReducer, FlashMessagesState } from "tws-common/ui/flash"
import { toastReducer, ToastState } from "tws-common/ui/toast"

export type State = {
	whatToPlayState: WTPState
	bfrState: MBFRState
	displayInfoState: DisplayInfoState
	syncedIdStore: SyncedIdStore
	playerUi: PlayerUIState
	toasts: ToastState
	flashes: FlashMessagesState
}

const syncedIdStoreReducer = createReducer<SyncedIdStore>({}, () => {
	// noop, it makes combineReducers happy though
})

const innerReducer = combineReducers<State>({
	bfrState: createBFRReducer(),
	whatToPlayState: whatToPlayReducer,
	syncedIdStore: syncedIdStoreReducer,
	playerUi: playerUiReducer,
	toasts: toastReducer,
	flashes: flashMessageReducer,
	displayInfoState: displayInfoReducer,
})

const finalReducer = wrapReducerForSync(
	innerReducer,
	{
		getSyncedIdStore: (s: State) => s.syncedIdStore,
		setSyncedIdStore: (s: State, st) => ({ ...s, syncedIdStore: st }),
	},
	[whatToPlayStateSynchronizer, bfrMetadataStateSynchronizer],
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

export const useWTPSelector = <T>(selector: (state: WTPState) => T) =>
	useSelector((state: State) => selector(state.whatToPlayState))

export const usePlayerUiSelector = <T>(selector: (state: PlayerUIState) => T) =>
	useSelector((state: State) => selector(state.playerUi))
