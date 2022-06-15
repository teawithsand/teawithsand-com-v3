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
			type: "raw-no-meta"
			sources: PlayerSource[]
	  }
	| {
			type: "raw-with-meta"
			sources: PlayerSourceWithMetadata[]
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

			if (state.config.source === null) {
				state.state = {
					type: "loaded",
					sources: [],
				}
			} else if (state.config.source.type === "raw-no-meta") {
				state.state = {
					type: "loaded",
					sources: state.config.source.sources.map(v => ({
						metadata: null,
						playerSource: v,
					})),
				}
			} else if (state.config.source.type === "raw-with-meta") {
				state.state = {
					type: "loaded",
					sources: state.config.source.sources,
				}
			} else {
				// TODO(teawithsand): trigger any load required here
				state.state = {
					type: "loading",
				}
			}
		}),
)
