import { createReducer } from "@reduxjs/toolkit"
import { AnyAction } from "redux"
import {
	setIsPlayingWhenReady,
	SimpleReduxPlayerState,
} from "tws-common/reduxplayer/simple"
import { onSleepTimedOut } from "tws-common/reduxplayer/sleep/actions"

export type SleepReduxState = {}

export const simpleReduxPlayerReducer = createReducer<SleepReduxState>(
	{},
	builder => {
		// noop
	},
)

export const wrapPlayerReducer = <
	T extends {
		simpleReduxPlayerState: SimpleReduxPlayerState
	},
>(
	state: T,
	action: AnyAction,
) => {
	if (action.type === onSleepTimedOut.type) {
		state = {
			...state,
			simpleReduxPlayerState: simpleReduxPlayerReducer(
				state.simpleReduxPlayerState,
				setIsPlayingWhenReady(false),
			),
		}
	}
}
