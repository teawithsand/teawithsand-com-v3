import { createAction } from "@reduxjs/toolkit"

import { MPlayerPlaylistMetadata } from "@app/domain/bfr/playlist"
import { MPlayerSource } from "@app/domain/bfr/source"
import { WTPPlaylistMetadata } from "@app/domain/wtp/playlist"
import { WTPError } from "@app/domain/wtp/WTPError"

import {
	claimId,
	NS_REDUX_ACTION_PREFIX,
} from "tws-common/misc/GlobalIDManager"
import { BFRPlaylist } from "tws-common/player/bfr/state"
import { makeActionPrefix } from "tws-common/redux/action"

const prefix = claimId(
	NS_REDUX_ACTION_PREFIX,
	makeActionPrefix(`palm-abooks-pwa/display-info`),
)

export const displayInfoSetWTPPlaylistMetadata =
	createAction<WTPPlaylistMetadata | null>(
		`${prefix}/displayInfoSetWTPPlaylist`,
	)

export const displayInfoSetBFRPlaylist = createAction<
	BFRPlaylist<MPlayerPlaylistMetadata, MPlayerSource> | null
>(`${prefix}/displayInfoSetBFRPlaylist`)

export const displayInfoSetWTPError = createAction<WTPError | null>(
	`${prefix}/displayInfoSetWTPError`,
)
