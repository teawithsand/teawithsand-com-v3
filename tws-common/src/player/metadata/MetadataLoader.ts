import Metadata from "tws-common/player/metadata/Metadata"
import PlayerSource from "tws-common/player/source/PlayerSource"

export default interface MetadataLoader {
	loadMetadata(src: PlayerSource, url?: string): Promise<Metadata>
}
