import { Store } from "redux"
import { DefaultTaskAtom } from "tws-common/lang/task/TaskAtom"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import PlayerSource, {
	PlayerSourceWithMetadata,
} from "tws-common/player/source/PlayerSource"
import { BFRPlaylistSelector, BFRState } from "tws-common/reduxplayer/bfr/state"

/**
 * SimplePlayer, which uses HTMLAudioElement | HTMLMediaElement | HTMLVideoElement
 * in order to provide controls.
 */
export class BFRMetadataLoader<T> {
	private releaseReduxStore: (() => void) | null = null
	private currentPlaylistId: string | null = null

	private readonly taskAtom = new DefaultTaskAtom()

	constructor(
		private readonly store: Store<T>,
		private readonly selector: (storeState: T) => BFRState,
		// Adapter for external metadata saving mechanism
		// it has to be
		private readonly saveMetadata: (
			source: PlayerSource,
			result: MetadataLoadingResult,
		) => Promise<void>,
	) {
		const unsubscribe = store.subscribe(() => {
			const state = selector(store.getState())
			const [playlist, id] = BFRPlaylistSelector(state)
			if (this.currentPlaylistId !== id) {
				this.currentPlaylistId = id

				// TODO(teawithsand): pass metadata loader config to this method
				this.triggerMetadataLoading(playlist)
			}
		})
		this.releaseReduxStore = () => unsubscribe()
	}

	private triggerMetadataLoading = (playlist: PlayerSourceWithMetadata[]) => {
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
