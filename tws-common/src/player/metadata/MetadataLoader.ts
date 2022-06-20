import Metadata from "tws-common/player/metadata/Metadata"
import { NewPlayerSource } from "tws-common/player/source/NewPlayerSource"

export default interface MetadataLoader<T extends NewPlayerSource> {
	loadMetadata(src: T): Promise<Metadata>
}
