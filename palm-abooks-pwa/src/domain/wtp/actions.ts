import { createAction } from "@reduxjs/toolkit"

import { MPlayerPlaylistMetadata } from "@app/domain/bfr/playlist"
import { MPlayerSource } from "@app/domain/bfr/source"
import { WTPPlaylistMetadata } from "@app/domain/wtp/playlist"

import { BFRPlaylist } from "tws-common/player/bfr/state"
import { makeActionPrefix } from "tws-common/redux/action"

const prefix = makeActionPrefix(`pab-source`)

export const setWTPPlaylist = createAction<WTPPlaylistMetadata | null>(
	`${prefix}/setWTPPlaylist`,
)

export const setWTPResolved = createAction<
	BFRPlaylist<MPlayerPlaylistMetadata, MPlayerSource>
>(`${prefix}/setWTPPlaylist`)

export const setWTPError = createAction<any>(`${prefix}/setWTPError`)
