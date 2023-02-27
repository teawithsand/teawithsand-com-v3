import Metadata from "tws-common/player/metadata/Metadata"
import { PlayerSource } from "tws-common/player/source/PlayerSource"

export default interface MetadataLoader<T extends PlayerSource> {
	loadMetadata(src: T): Promise<Metadata>
}
export { MetadataLoader }
