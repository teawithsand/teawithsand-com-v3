import { combineReducers, configureStore } from "@reduxjs/toolkit"

import {
	simpleReduxPlayerReducer,
	SimpleReduxPlayerState,
} from "tws-common/reduxplayer/simple"
import {
	whatToPlayReducer,
	WhatToPlayState,
	wrapWhatToPlayToPlayerReducer,
} from "tws-common/reduxplayer/whattoplay"

export type State = {
	simpleReduxPlayerState?: SimpleReduxPlayerState
	whatToPlayState?: WhatToPlayState
}

export const reducer = wrapWhatToPlayToPlayerReducer(
	combineReducers({
		whatToPlayState: whatToPlayReducer,
		simpleReduxPlayerState: simpleReduxPlayerReducer,
	}),
)

export const store = configureStore({
	reducer,
	devTools: false,
})
