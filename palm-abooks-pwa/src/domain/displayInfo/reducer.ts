import { createReducer } from "@reduxjs/toolkit"

import {
	displayInfoSetMetadataBag,
	displayInfoSetPlaylist,
	displayInfoSetStateResolved,
} from "@app/domain/displayInfo/actions"
import { DisplayInfoState } from "@app/domain/displayInfo/state"

import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import { makeSyncRoot } from "tws-common/redux/sync/root"

const LOG_TAG = claimId(NS_LOG_TAG, "palm-abooks-pwa/DisplayInfo")

export const displayInfoReducer = createReducer<DisplayInfoState>(
	{
		sync: {
			playlist: makeSyncRoot(null),
			metadataBag: makeSyncRoot(new MetadataBag([])),
		},
		resolved: null,
		state: {
			type: "no-sources",
		},
	},
	builder => {
		builder
			.addCase(displayInfoSetPlaylist, (state, action) => {
				const { payload } = action
				state.sync.playlist = makeSyncRoot(payload)
				state.resolved = null

				LOG.info(LOG_TAG, "Got playlist", state.sync.playlist.data)
			})
			.addCase(displayInfoSetMetadataBag, (state, action) => {
				const { payload } = action
				state.sync.metadataBag = makeSyncRoot(payload)

				LOG.info(
					LOG_TAG,
					"Got metadata bag",
					state.sync.metadataBag.data,
				)
				// TODO(teawithsand): notify reducer that update is pending now
				//   and unset that pending flag in setResolved call
			})
			.addCase(displayInfoSetStateResolved, (state, action) => {
				const { data, playlistSyncRootId } = action.payload
				if (state.sync.playlist.id !== playlistSyncRootId) {
					LOG.warn(
						LOG_TAG,
						"Sync playlist's id is not equal to computed-for playlist id. Ignoring call...",
					)
				} else {
					state.resolved = data
				}
			})
	},
)
