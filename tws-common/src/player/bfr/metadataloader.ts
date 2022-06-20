import { Store } from "redux"
import { DefaultTaskAtom } from "tws-common/lang/task/TaskAtom"
import {
	BFRPlaylist,
	bfrPlaylistSelector,
	BFRState,
} from "tws-common/player/bfr/state"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import { NewPlayerSource } from "tws-common/player/source/NewPlayerSource"
import { SyncId } from "tws-common/redux/sync/id"

/**
 * SimplePlayer, which uses HTMLAudioElement | HTMLMediaElement | HTMLVideoElement
 * in order to provide controls.
 */
export class BFRMetadataLoader<T, PM, PS extends NewPlayerSource> {
	private releaseReduxStore: (() => void) | null = null
	private currentPlaylistId: SyncId | null = null

	private readonly taskAtom = new DefaultTaskAtom()

	constructor(
		private readonly store: Store<T>,
		private readonly selector: (storeState: T) => BFRState<PM, PS>,
		// Adapter for external metadata saving mechanism
		// it has to be
		private readonly saveMetadata: (
			source: PS,
			result: MetadataLoadingResult,
		) => Promise<void>,
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

			// TODO(teawithsand): here load metadata and then trigger save
			// + trigger metadata updated event in redux store
		})()
	}

	release = () => {
		if (this.releaseReduxStore !== null) {
			this.releaseReduxStore()
			this.releaseReduxStore = null
		}
	}
}
