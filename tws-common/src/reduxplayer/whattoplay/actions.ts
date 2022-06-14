import { createAction } from "@reduxjs/toolkit"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import { makeActionPrefix } from "tws-common/redux/action"
import { LoadedSource } from "tws-common/reduxplayer/whattoplay/source"

const prefix = makeActionPrefix("what-to-play")

export const setLoadedSources = createAction<LoadedSource[]>(
	`${prefix}/setLoadedSources`,
)

export const updateSourceMetadata = createAction<{
	index: number
	metadata: MetadataLoadingResult | null
}>(`${prefix}/updateSourceMetadata`)
