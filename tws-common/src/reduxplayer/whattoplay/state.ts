import { TaskAtom } from "tws-common/lang/task/TaskAtom"
import MetadataBag from "tws-common/player/metadata/MetadataBag"
import MetadataLoader from "tws-common/player/metadata/MetadataLoader"
import PlayerSource from "tws-common/player/source/PlayerSource"
import { LoadedSource } from "tws-common/reduxplayer/whattoplay/source"

export type WhatToPlayState = {
	deps: {
		atom: TaskAtom
		loader: MetadataLoader
	}
	config: {
		loadMetadataPolicy: "never" | "not-loaded" | "not-loaded-or-error"
		loadedMetadataResultSave: boolean
		loadedSources: LoadedSource[]
	}
	state: {
		playerSources: PlayerSource[]
		metadataBag: MetadataBag
	}
}
