import { createReducer } from "@reduxjs/toolkit"

import {
	displayInfoSetBFRPlaylist,
	displayInfoSetWTPPlaylistMetadata,
} from "@app/domain/displayInfo/actions"
import { DisplayInfoState } from "@app/domain/displayInfo/state"

export const displayInfoReducer = createReducer<DisplayInfoState>(
	{
		sync: {
			bfrPlaylist: null,
			wtpPlaylistMetadata: null,
			error: null,
		},
		state: {
			type: "no-sources",
		},
	},
	builder => {
		builder
			.addCase(displayInfoSetBFRPlaylist, (state, action) => {
				state.sync.error = null
				state.sync.bfrPlaylist = action.payload
				if (state.sync.bfrPlaylist) {
					state.state = {
						type: "loading",
						info: {
							currentInfo: null,
							playbackTitle: null,
							sources: null,
						},
					}
				} else {
					state.state = {
						type: "no-sources",
					}
				}
			})
			.addCase(displayInfoSetWTPPlaylistMetadata, (state, action) => {
				state.sync.wtpPlaylistMetadata = action.payload // this one does not really matter
			})
		// TODO(teawithsand): add actions here
	},
)
