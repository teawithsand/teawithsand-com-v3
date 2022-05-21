import { createReducer } from "@reduxjs/toolkit"

import { ArrayPlayerSourceProvider } from "@app/components/player/source/PlayerSourceProvider"
import PlayerState from "@app/components/player/redux/PlayerState"

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
	createReducer(initialPlayerState, builder => {})
