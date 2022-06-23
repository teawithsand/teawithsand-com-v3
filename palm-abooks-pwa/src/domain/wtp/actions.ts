import { createAction } from "@reduxjs/toolkit"

import { WTPPlaylist } from "@app/domain/wtp/playlist"

import { makeActionPrefix } from "tws-common/redux/action"

const prefix = makeActionPrefix(`pab-source`)

export const setWhatToPlaySource = createAction<WTPPlaylist | null>(
	`${prefix}/setWhatToPlaySource`,
)
