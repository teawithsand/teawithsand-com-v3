import { MPlaylistMetadata } from "@app/domain/bfr/playlist"
import { MPlayerSource } from "@app/domain/bfr/source"

import {
	BFRMetadataLoaderAdapter,
	BFRMetadataLoaderResults,
} from "tws-common/player/bfr/metadataLoader"
import { BFRPlaylist } from "tws-common/player/bfr/state"
import DefaultMetadataLoader from "tws-common/player/metadata/loader/DefaultMetadataLoader"
import MetadataLoader from "tws-common/player/metadata/loader/MetadataLoader"
import { MetadataLoadingResultType } from "tws-common/player/metadata/Metadata"
import { PlayerSourceResolver } from "tws-common/player/source/PlayerSourceResolver"

export class MBFRMetadataLoaderAdapter
	implements BFRMetadataLoaderAdapter<MPlaylistMetadata, MPlayerSource>
{
	private readonly metadataLoader: MetadataLoader<MPlayerSource>
	constructor(
		private readonly sourceResolver: PlayerSourceResolver<MPlayerSource>,
	) {
		this.metadataLoader = new DefaultMetadataLoader(this.sourceResolver)
	}

	loadFromPlaylistMetadata = async (
		playlist: BFRPlaylist<MPlaylistMetadata, MPlayerSource>,
		results: BFRMetadataLoaderResults,
	): Promise<void> => {
		// noop
	}

	loadForSource = async (
		playlist: BFRPlaylist<MPlaylistMetadata, MPlayerSource>,
		results: BFRMetadataLoaderResults,
		i: number,
	): Promise<void> => {
		const source = playlist.sources[i]
		try {
			const metadata = await this.metadataLoader.loadMetadata(source)
			results[i] = {
				type: MetadataLoadingResultType.OK,
				metadata,
			}
		} catch (e) {
			results[i] = {
				type: MetadataLoadingResultType.ERROR,
				error: `Metadata loading filed: ${e}`,
			}
		}
	}

	saveResults = async (
		playlist: BFRPlaylist<MPlaylistMetadata, MPlayerSource>,
		results: BFRMetadataLoaderResults,
	): Promise<void> => {
		// noop for now
	}
}
