import { configureStore, combineReducers } from "@reduxjs/toolkit"

import { BFRReducer } from "tws-common/player/bfr/reducer"

const reducer = combineReducers({
	BFRReducer,
})

export const store = configureStore({
	reducer,
	devTools: false,
})
