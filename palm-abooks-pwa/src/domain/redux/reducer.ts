import { ABookActiveRecord } from "@app/domain/abook/ABookStore"
import { setWhatToPlaySource } from "@app/domain/redux/actions"
import { createReducer } from "@reduxjs/toolkit"
import { generateUUID } from "tws-common/lang/uuid"
import PlayerSource, {
	PlayerSourceWithMetadata,
} from "tws-common/player/source/PlayerSource"

export type WhatToPlaySource =
	| {
			type: "abook"
			abook: ABookActiveRecord
	  }
	| {
			type: "raw"
			sources: PlayerSource[]
	  }

type WhatToPlayStateState =
	| {
			type: "loading"
	  }
	| {
			type: "loaded"
			sources: PlayerSourceWithMetadata[]
	  }

export type WhatToPlayState = {
	config: {
		source: WhatToPlaySource | null
	}
	state: WhatToPlayStateState
	syncState: {
		currentSourcesId: string
		setSourcesId: string
	}
}

export const whatToPlayReducer = createReducer<WhatToPlayState>(
	{
		config: {
			source: null,
		},
		state: {
			type: "loaded",
			sources: [],
		},
		syncState: {
			currentSourcesId: "no-sources",
			setSourcesId: "no-sources",
		},
	},
	builder =>
		builder.addCase(setWhatToPlaySource, (state, action) => {
			state.config.source = action.payload
			state.syncState.currentSourcesId = generateUUID()
		}),
)
