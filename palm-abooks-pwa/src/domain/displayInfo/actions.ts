import { createAction } from "@reduxjs/toolkit"

import {
	DisplayInfoPlaylist,
	DisplayInfoStateResolved,
} from "@app/domain/displayInfo/state"

import {
	claimId,
	NS_REDUX_ACTION_PREFIX,
} from "tws-common/misc/GlobalIDManager"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import { makeActionPrefix } from "tws-common/redux/action"
import { SyncId } from "tws-common/redux/sync/id"

const prefix = claimId(
	NS_REDUX_ACTION_PREFIX,
	makeActionPrefix(`palm-abooks-pwa/display-info`),
)

export const displayInfoSetPlaylist = createAction<DisplayInfoPlaylist | null>(
	`${prefix}/displayInfoSetPlaylist`,
)

export const displayInfoSetStateResolved = createAction<{
	data: DisplayInfoStateResolved | null
	playlistSyncRootId: SyncId
}>(`${prefix}/displayInfoSetResolved`)

export const displayInfoSetMetadataBag = createAction<MetadataBag>(
	`${prefix}/displayInfoSetMetadataBag`,
)
