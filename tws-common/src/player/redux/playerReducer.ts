import { createReducer } from "@reduxjs/toolkit"

import PlayerState from "tws-common/player/redux/PlayerState"
import { ArrayPlayerSourceProvider } from "tws-common/player/source/PlayerSourceProvider"

const actionPrefix = "twsblog/player"

const initialPlayerState: Readonly<PlayerState> = {
	userState: {
		currentSourceIndex: -1,
		sourceProvider: new ArrayPlayerSourceProvider([]),
		playbackRate: 1,
		seek: null,
	},
	driverState: null,
}

export const createPlayerReducer = () =>
	createReducer(initialPlayerState, builder => {
		// for now niy, since no actions
	})
