import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import PlayerSource from "tws-common/player/source/PlayerSource"

export type SourceWithMetadata = {
	playerSource: PlayerSource
	metadata: MetadataLoadingResult | null
}

export interface LoadedSource {
	readonly playerSource: PlayerSource
	readonly metadata: MetadataLoadingResult | null

	setMetadata(metadata: MetadataLoadingResult | null): Promise<void>
}
