import { createAction, createReducer } from "@reduxjs/toolkit";



import { makeActionPrefix } from "tws-common/redux/action";


export type PlayerUIModal = "speed" | "sleep"

export type PlayerUIState = {
	shownModal: PlayerUIModal | null
}

const prefix = makeActionPrefix("palm-abooks-pwa/player-ui")

export const playerUiSetShownModal = createAction<PlayerUIModal | null>(
	`${prefix}/playerUiSetShownModal`,
)

export const playerUiReducer = createReducer<PlayerUIState>(
	{
		shownModal: null,
	},
	builder => {
		builder.addCase(playerUiSetShownModal, (state, action) => {
			state.shownModal = action.payload
		})
	},
)