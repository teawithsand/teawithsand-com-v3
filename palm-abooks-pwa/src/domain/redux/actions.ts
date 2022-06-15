import { WhatToPlaySource } from "@app/domain/redux/reducer"
import { createAction } from "@reduxjs/toolkit"
import { makeActionPrefix } from "tws-common/redux/action"

const prefix = makeActionPrefix(`pab-source`)

export const setWhatToPlaySource = createAction<WhatToPlaySource | null>(
	`${prefix}/setWhatToPlaySource`,
)
