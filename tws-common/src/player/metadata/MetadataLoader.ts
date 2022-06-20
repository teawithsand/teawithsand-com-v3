import Metadata from "tws-common/player/metadata/Metadata"
import { NewPlayerSource } from "tws-common/player/newsource/NewPlayerSource"

export default interface MetadataLoader<T extends NewPlayerSource> {
	loadMetadata(src: T): Promise<Metadata>
}
