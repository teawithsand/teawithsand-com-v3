import { Store } from "redux"
import {
	BFRMediaSessionMode,
	bfrPlaylistSelector,
	BFRState,
} from "tws-common/player/bfr/state"
import { MetadataLoadingResult } from "tws-common/player/metadata/Metadata"
import { SyncId } from "tws-common/redux/sync/id"
import {
	allMediaSessionActions,
	MediaSessionEvent,
	MediaSessionHelper,
	MediaSessionMetadata,
	MediaSessionPositionState,
} from "tws-common/webapi/mediaSession/MediaSessionHelper"

const LOG_TAG = "tws-common/BFRMediaSession"

export type BFRMetadataLoaderResults = (MetadataLoadingResult | null)[]

export interface BFRMediaSessionAdapter<S, PM> {
	selectPlayerState(state: S): "playing" | "paused" | "none"
	selectPositionState(state: S): MediaSessionPositionState
	selectMetadata(playerMetadata: PM): MediaSessionMetadata

	/**
	 * Dispatch should be supplied externally.
	 * There is no reason to provide it here.
	 */
	handleMediaSessionEvent(event: MediaSessionEvent): void
}

/**
 * SimplePlayer, which uses HTMLAudioElement | HTMLMediaElement | HTMLVideoElement
 * in order to provide controls.
 */
export class BFRMediaSession<T, PM> {
	private innerRelease: (() => void) | null = null
	private currentPlaylistId: SyncId | null = null

	constructor(
		store: Store<T>,
		selector: (storeState: T) => BFRState<PM, unknown>,
		adapter: BFRMediaSessionAdapter<T, PM>,
	) {
		const unsubscribeStore = store.subscribe(() => {
			const innerState = store.getState()
			const state = selector(innerState)

			if (
				state.mediaSessionConfig.mode ===
				BFRMediaSessionMode.ENABLED_WHEN_PLAYLIST_SET
			) {
				const { data: playlist, id } = bfrPlaylistSelector(state)
				if (!playlist) {
					MediaSessionHelper.setPlaybackState("none")
					MediaSessionHelper.setSupportedActions([])
				} else {
					if (this.currentPlaylistId !== id) {
						this.currentPlaylistId = id

						MediaSessionHelper.setSupportedActions(
							allMediaSessionActions,
						)
					}

					// We have playlist here and we are playing/paused/error or sth on something
					const mediaSessionMetadata = adapter.selectMetadata(
						playlist.metadata,
					)
                    // TODO(teawithsand): call this function less often, only when it's needed
                    //  because values have changed
					MediaSessionHelper.setMetadata(mediaSessionMetadata)

					const isPlaying = state.playerConfig.isPlayingWhenReady
					const error =
						!!state.playerState.sourceError ||
						!!state.playerState.playerError

					if (isPlaying && !error) {
						const positionState =
							adapter.selectPositionState(innerState)
						MediaSessionHelper.setPositionState(positionState)
						MediaSessionHelper.setPlaybackState("playing")
					} else {
						MediaSessionHelper.setPlaybackState("paused")
					}
				}
			} else {
				// fallback to disabled state
				// on any unknown state
				// and disabled state ofc
				MediaSessionHelper.setPlaybackState("none")
				MediaSessionHelper.setSupportedActions([])
			}
		})

		const unsubscribeMediaSessionEvent =
			MediaSessionHelper.eventBus.addSubscriber(event => {
				adapter.handleMediaSessionEvent(event)
			})
		this.innerRelease = () => {
			unsubscribeMediaSessionEvent()
			unsubscribeStore()
		}
	}

	release = () => {
		if (this.innerRelease !== null) {
			this.innerRelease()
			this.innerRelease = null
		}
	}
}
