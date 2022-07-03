import { createReducer } from "@reduxjs/toolkit"

import {
	displayInfoSetPlaylist,
	displayInfoSetStateResolved,
} from "@app/domain/displayInfo/actions"
import {
	DisplayInfoState,
	DisplayInfoStateState,
} from "@app/domain/displayInfo/state"

import { LOG } from "tws-common/log/logger"
import { claimId, NS_LOG_TAG } from "tws-common/misc/GlobalIDManager"
import { makeSyncRoot } from "tws-common/redux/sync/root"

const LOG_TAG = claimId(NS_LOG_TAG, "palm-abooks-pwa/DisplayInfo")

const computeDisplayInfoStateState = (
	outerState: DisplayInfoState,
): DisplayInfoStateState => {
	/*
	const { sync } = outerState

	const info = {
		currentInfo: null,
		playbackTitle: null,
		sources: null,
	}

	if (sync.error) {
		return {
			type: "error",
			error: new DisplayInfoError(
				"WTPError caused playlist data computation to fail",
				sync.error,
			),
			info,
		}
	} else if (!sync.playlist && !sync.wtpPlaylistMetadata) {
		return {
			type: "no-sources",
		}
	} else {
		if(sync.wtpPlaylistMetadata) {
			if(sync.wtpPlaylistMetadata.type === WTPPlaylistMetadataType.ABOOK) {

			}
		}
	}
	*/
	throw new Error("NIY")
}

export const displayInfoReducer = createReducer<DisplayInfoState>(
	{
		sync: {
			playlist: makeSyncRoot(null),
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
