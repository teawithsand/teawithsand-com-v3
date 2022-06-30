import {
	ABookFileMetadata,
	ABookFileMetadataType,
} from "@app/domain/abook/typedef"
import {
	MPlayerPlaylistMetadata,
	MPlayerPlaylistMetadataType,
} from "@app/domain/bfr/playlist"
import { MPlayerSource } from "@app/domain/bfr/source"
import { WTPSourceType } from "@app/domain/wtp/source"

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
	implements BFRMetadataLoaderAdapter<MPlayerPlaylistMetadata, MPlayerSource>
{
	private readonly metadataLoader: MetadataLoader<MPlayerSource>
	constructor(
		private readonly sourceResolver: PlayerSourceResolver<MPlayerSource>,
	) {
		this.metadataLoader = new DefaultMetadataLoader(this.sourceResolver)
	}

	loadFromPlaylistMetadata = async (
		playlist: BFRPlaylist<MPlayerPlaylistMetadata, MPlayerSource>,
		results: BFRMetadataLoaderResults,
	): Promise<void> => {
		// noop, nothing to load from playlist data for source.
	}

	loadForSource = async (
		playlist: BFRPlaylist<MPlayerPlaylistMetadata, MPlayerSource>,
		results: BFRMetadataLoaderResults,
		i: number,
	): Promise<void> => {
		const source = playlist.sources[i]

		if (source.preloadedMetadata !== null) {
			results[i] = source.preloadedMetadata
			return
		}

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
		playlist: BFRPlaylist<MPlayerPlaylistMetadata, MPlayerSource>,
		results: BFRMetadataLoaderResults,
	): Promise<void> => {
		// TODO(teawithsand): fix potential race condition
		//  in future, save results using playlist info
		//  please note that this should be locked action
		//  since we should not do race condition here
		//  and write to same data simultaneously in some rare cases

		if (playlist.metadata.type === MPlayerPlaylistMetadataType.ABOOK) {
			for (let i = 0; i < playlist.sources.length; i++) {
				const s = playlist.sources[i]
				const r = results[i]

				if (
					s.whatToPlaySource.type ===
						WTPSourceType.ABOOK_FILE_SOURCE &&
					s.whatToPlaySource.abookId === playlist.metadata.abook.id
				) {
					const metadata =
						await playlist.metadata.abook.files.getMetadata(
							s.whatToPlaySource.sourceId,
						)
					if (!metadata) {
						// removed whatever
						// just ignore it
						// or log maybe
						// but that's it
						return
					}

					if (metadata.type === ABookFileMetadataType.PLAYABLE_FILE || metadata.type === ABookFileMetadataType.PLAYABLE_URL) {
						const newMetadata: ABookFileMetadata = {
							...metadata,
							metadataLoadingResult: r,
						}

						await playlist.metadata.abook.files.setMetadata(
							s.whatToPlaySource.sourceId,
							newMetadata,
						)
					}
				}
			}
		}
	}
}
