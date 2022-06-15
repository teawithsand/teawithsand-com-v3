import { whatToPlayReducer, WhatToPlayState } from "@app/domain/redux/reducer"
import {
	AnyAction,
	combineReducers,
	configureStore,
	createAction,
} from "@reduxjs/toolkit"
import { useSelector } from "react-redux"

import { BFRReducer } from "tws-common/player/bfr/reducer"
import { setPlaylist } from "tws-common/player/bfr/actions"
import { BFRState } from "tws-common/player/bfr/state"
import produce from "immer"

export type State = {
	whatToPlayState: WhatToPlayState
	bfrState: BFRState
}

const innerReducer = combineReducers<State>({
	bfrState: BFRReducer,
	whatToPlayState: whatToPlayReducer,
})

// This is also known as syncing reducer
// TODO(teawithsand): create utils for creating these kind of syncing reducers
//  They are more useful than it looks
const topReducer = (state: State, action: AnyAction): State => {
	const newState = innerReducer(state, action)
	if (
		newState.whatToPlayState.syncState.currentSourcesId !==
		newState.whatToPlayState.syncState.setSourcesId
	) {
		const immState: State = {
			...newState,
			bfrState: BFRReducer(
				newState.bfrState,
				setPlaylist(
					newState.whatToPlayState.state.type === "loaded"
						? newState.whatToPlayState.state.sources
						: [],
				),
			),
		}

		return produce(immState, draft => {
			draft.whatToPlayState.syncState.setSourcesId =
				draft.whatToPlayState.syncState.currentSourcesId
		})
	}

	console.log("TLReducer default case", newState, action)
	return newState
}

export const createStore = () =>
	configureStore<State>({
		reducer: topReducer,
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
