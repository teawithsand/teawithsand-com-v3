import { Store } from "redux"
import { DefaultTaskAtom } from "tws-common/lang/task/TaskAtom"
import { LOG } from "tws-common/log/logger"
import {
	onExternalSetIsPlayingWhenReady,
	onNewPlayerState,
	onSourcePlaybackEnded,
} from "tws-common/player/bfr/actions"
import { BFRState } from "tws-common/player/bfr/state"
import PlayerSource from "tws-common/player/source/PlayerSource"
import { DEFAULT_PLAYER_SOURCE_RESOLVER } from "tws-common/player/source/PlayerSourceResolver"
import PlayerReadyState from "tws-common/player/tool/PlayerReadyState"
import { readHTMLPlayerState } from "tws-common/player/tool/readState"
import { SyncId } from "tws-common/redux/sync/id"

type Element = HTMLAudioElement | HTMLMediaElement | HTMLVideoElement

const LOG_TAG = "tws-common/BFRPlayer"

/**
 * SimplePlayer, which uses HTMLAudioElement | HTMLMediaElement | HTMLVideoElement
 * in order to provide controls.
 */
export class BFRPlayer<T> {
	private eventListeners: {
		event: string
		listener: any
	}[] = []

	private sourceCleanup: (() => void) | null = null
	private releaseReduxStore: (() => void) | null = null

	private currentPlaylistId: SyncId | null = null
	private currentPlaylist: PlayerSource[] = []
	private currentEntryIndex = 0

	private sourceError: any | null = null
	private lastSeekId: SyncId | null = null

	private readonly taskAtom = new DefaultTaskAtom()
	private isLoadingSource = false
	private isIsPlayingSynchronizedAfterSourceLoaded = false

	constructor(
		private readonly element: Element,
		private readonly store: Store<T>,
		private readonly selector: (storeState: T) => BFRState,
	) {
		this.hookToElement()
		const unsubscribe = store.subscribe(() => {
			const state = selector(store.getState())
			const { playerConfig } = state
			if (playerConfig.speed !== element.playbackRate) {
				element.playbackRate = playerConfig.speed
			}

			if (playerConfig.volume !== element.volume) {
				element.volume = playerConfig.volume
			}
			this.syncPlaylist(state)
			this.syncSource(state)
			this.syncIsPlayingWhenReady(state)

			if (
				playerConfig.seekData.data &&
				playerConfig.seekData.id !== this.lastSeekId
			) {
				const seekData = playerConfig.seekData.data
				this.lastSeekId = playerConfig.seekData.id
				this.seek(seekData.position)
			}
		})
		this.releaseReduxStore = () => unsubscribe()
	}

	private readAndEmitHTMLElementState = () => {
		if (this.releaseReduxStore === null) return // although it shouldn't, it may happen; exit then
		const playerState = readHTMLPlayerState(this.element)

		LOG.debug(LOG_TAG, "ReadAndEmitPlayerState", {
			sourceSet: this.sourceCleanup !== null,
			loadingSource: this.isLoadingSource,
			isDoneIsPlayingSyncAfterSourceLoaded:
				this.isIsPlayingSynchronizedAfterSourceLoaded,
			...playerState,
		})

		if (playerState.isEnded) {
			this.store.dispatch(onSourcePlaybackEnded())
		}

		if (
			!this.isLoadingSource &&
			this.isIsPlayingSynchronizedAfterSourceLoaded &&
			this.sourceCleanup !== null &&
			!playerState.isEnded &&
			!playerState.error &&
			!playerState.isSeeking
		) {
			// Once we are in ended state
			// pause triggers.
			//
			// Also, when we call load
			// pause gets triggered
			// so this is covered as well
			//
			// Also, setting null source triggers paused case as well
			// so handle it.
			//
			//
			// Moreover, once source is loaded there is short moment before sync of IPWR is triggered, when we are not playing
			// which may cause this to fire, which is not what we want, so we capture it.

			// if we can use get state
			// just do that
			// even though it's hack
			const state = this.selector(this.store.getState())

			if (state.playerConfig.isPlayingWhenReady) {
				if (playerState.paused) {
					this.store.dispatch(onExternalSetIsPlayingWhenReady(false))
				}
			} else {
				const isReadyStateOk =
					playerState.readyState === PlayerReadyState.FUTURE_DATA ||
					playerState.readyState === PlayerReadyState.ENOUGH_DATA ||
					playerState.readyState === PlayerReadyState.CURRENT_DATA
					
				if (
					!playerState.paused &&
					isReadyStateOk &&
					playerState.isPlaying
				) {
					this.store.dispatch(onExternalSetIsPlayingWhenReady(true))
				}
			}
		}

		this.store.dispatch(
			onNewPlayerState({
				playerError: playerState.error,
				sourceError: this.sourceError,

				networkState: playerState.networkState,
				readyState: playerState.readyState,
				isPlaying: playerState.isPlaying,
				isSeeking: playerState.isSeeking,
				isInnerEnded: playerState.isEnded,

				duration: playerState.duration,
				position: playerState.currentTime,
			}),
		)
	}

	private hookToElement = () => {
		const regListener = (event: string, listener: (e: Event) => void) => {
			const actualListener = (e: Event) => {
				listener(e)
			}

			this.element.addEventListener(event, actualListener)
			this.eventListeners.push({
				listener: actualListener,
				event,
			})
		}

		const handleStateChange = () => this.readAndEmitHTMLElementState()

		regListener("error", e => {
			e.stopPropagation()
			e.preventDefault()

			handleStateChange()
		})

		regListener("timeupdate", () => handleStateChange())
		regListener("durationchange", () => handleStateChange())
		regListener("ended", () => {
			handleStateChange()
			this.store.dispatch(onSourcePlaybackEnded())
		})
		regListener("seeking", () => handleStateChange())
		regListener("seeked", () => handleStateChange())
		regListener("progress", () => handleStateChange())
		regListener("canplay", () => handleStateChange())
		regListener("canplaythrough", () => handleStateChange())
		regListener("waiting", () => handleStateChange())
		regListener("pause", () => handleStateChange())
		regListener("play", () => handleStateChange())
	}

	release = () => {
		if (this.releaseReduxStore !== null) {
			this.eventListeners.forEach(e => {
				this.element.removeEventListener(e.event, e.listener)
			})

			this.releaseReduxStore()
			this.releaseReduxStore = null

			this.element.pause()
			this.element.src = ""

			if (this.sourceCleanup) {
				this.sourceCleanup()
				this.sourceCleanup = null
			}
		}
	}

	private syncIsPlayingWhenReady = (state: BFRState) => {
		if (!this.isLoadingSource && state.playerConfig.isPlayingWhenReady) {
			this.element.play().catch(() => {
				// noop here
				// ignore playing error, we will reset it when we want if needed
			})
		} else {
			this.element.pause()
		}

		if (!this.isLoadingSource) {
			this.isIsPlayingSynchronizedAfterSourceLoaded = true
		}
	}

	private syncPlaylist = (state: BFRState) => {
		if (state.playerConfig.playlist.id !== this.currentPlaylistId) {
			this.currentPlaylistId = state.playerConfig.playlist.id

			this.currentPlaylist = state.playerConfig.playlist.data.map(
				v => v.playerSource,
			)
			this.currentEntryIndex = -1 // any index, but must not equal current one
		}
	}

	private syncSource = (state: BFRState) => {
		const targetSourceIndex = state.playerConfig.currentSourceIndex

		if (targetSourceIndex !== this.currentEntryIndex) {
			const src =
				targetSourceIndex < this.currentPlaylist.length
					? this.currentPlaylist[targetSourceIndex]
					: null
			this.currentEntryIndex = targetSourceIndex
			const prevSourceCleanup = this.sourceCleanup

			LOG.debug(LOG_TAG, "loading source(or unsetting if none)", src)

			try {
				this.sourceCleanup = null
				this.isLoadingSource = true
				this.isIsPlayingSynchronizedAfterSourceLoaded = false
				if (src !== null) {
					// It's temporary quick'n'dirty fix
					// In fact, even though this claim is here
					// this logic here could use cancelation logic
					// which would stop pending loadings
					// from finishing

					const claim = this.taskAtom.claim()
					;(async () => {
						let url: string
						let close: () => void
						try {
							;[url, close] =
								await DEFAULT_PLAYER_SOURCE_RESOLVER.obtainURL(
									src,
								)
						} catch (e) {
							if (!claim.isValid) return
							this.element.src = ""
							this.sourceError = e

							LOG.warn(LOG_TAG, "loading source error", e)
							return
						}
						if (!claim.isValid) {
							close()
							return
						}

						this.element.src = url
						this.sourceCleanup = close

						// load resets playback rate and volume(?)
						this.element.load()
						this.element.playbackRate = state.playerConfig.speed
						this.element.volume = state.playerConfig.volume

						this.readAndEmitHTMLElementState()
					})().finally(() => {
						this.isLoadingSource = false
					})
				} else {
					if (this.element.src !== "") {
						this.element.src = ""
						this.readAndEmitHTMLElementState()
					}
					this.isLoadingSource = false
				}
			} finally {
				if (prevSourceCleanup) prevSourceCleanup()
			}
		}
	}

	private seek = (to: number) => {
		this.element.currentTime = to
	}
}
