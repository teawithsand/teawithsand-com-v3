import { Store } from "redux"
import { DefaultTaskAtom } from "tws-common/lang/task/TaskAtom"
import { LOG } from "tws-common/log/logger"
import { setMetadataLoadingResults } from "tws-common/player/bfr/actions"
import {
	BFRPlaylist,
	bfrPlaylistSelector,
	BFRState,
} from "tws-common/player/bfr/state"
import {
	MetadataLoadingResult,
	MetadataLoadingResultType,
} from "tws-common/player/metadata/Metadata"
import { PlayerSource } from "tws-common/player/source/PlayerSource"
import { SyncId } from "tws-common/redux/sync/id"

const LOG_TAG = "tws-common/BFRMetadataLoader"

export type BFRMetadataLoaderResults = (MetadataLoadingResult | null)[]

export interface BFRMetadataLoaderAdapter<PM, PS> {
	loadFromPlaylistMetadata(
		playlist: BFRPlaylist<PM, PS>,
		results: BFRMetadataLoaderResults,
	): Promise<void>

	loadForSource(
		playlist: BFRPlaylist<PM, PS>,
		results: BFRMetadataLoaderResults,
		index: number,
	): Promise<void>

	saveResults(
		playlist: BFRPlaylist<PM, PS>,
		results: BFRMetadataLoaderResults,
	): Promise<void>
}

/**
 * SimplePlayer, which uses HTMLAudioElement | HTMLMediaElement | HTMLVideoElement
 * in order to provide controls.
 */
export class BFRMetadataLoader<T, PM, PS extends PlayerSource> {
	private releaseReduxStore: (() => void) | null = null
	private currentPlaylistId: SyncId | null = null

	private readonly taskAtom = new DefaultTaskAtom()

	constructor(
		private readonly store: Store<T>,
		private readonly selector: (storeState: T) => BFRState<PM, PS>,
		private readonly adapter: BFRMetadataLoaderAdapter<PM, PS>,
	) {
		const unsubscribe = store.subscribe(() => {
			const state = selector(store.getState())
			const { data: playlist, id } = bfrPlaylistSelector(state)
			if (this.currentPlaylistId !== id) {
				this.currentPlaylistId = id

				// TODO(teawithsand): pass metadata loader config to this method
				if (playlist && playlist.sources.length > 0) {
					this.triggerMetadataLoading(playlist)
				}
			}
		})
		this.releaseReduxStore = () => unsubscribe()
	}

	private triggerMetadataLoading = (playlist: BFRPlaylist<PM, PS>) => {
		const claim = this.taskAtom.claim()
		;(async () => {
			if (!claim.isValid) return

			const results: BFRMetadataLoaderResults = new Array(
				playlist.sources.length,
			).fill(null)

			try {
				await this.adapter.loadFromPlaylistMetadata(playlist, results)
			} catch (e) {
				LOG.error(
					LOG_TAG,
					"adapter has thrown during loadFromPlaylistMetadata",
					e,
				)
			}

			if (!claim.isValid) return
			this.store.dispatch(setMetadataLoadingResults(results))

			for (let i = 0; i < playlist.sources.length; i++) {
				const r = results[i]

				if (r === null || r.type === MetadataLoadingResultType.ERROR) {
					try {
						await this.adapter.loadForSource(playlist, results, i)
					} catch (e) {
						LOG.error(
							LOG_TAG,
							"adapter has thrown during loadForSource",
							e,
						)
					}

					if (!claim.isValid) return
					this.store.dispatch(setMetadataLoadingResults(results))
				}
			}

			if (!claim.isValid) return
			await this.adapter.saveResults(playlist, results)
		})()
	}

	release = () => {
		if (this.releaseReduxStore !== null) {
			this.releaseReduxStore()
			this.releaseReduxStore = null
		}
	}
}
