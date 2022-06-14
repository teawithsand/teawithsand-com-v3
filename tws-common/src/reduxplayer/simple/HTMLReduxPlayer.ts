import { Store } from "redux";
import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState";
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState";
import PlayerSource from "tws-common/player/source/PlayerSource";
import { DEFAULT_PLAYER_SOURCE_RESOLVER } from "tws-common/player/source/PlayerSourceResolver";
import { readHTMLPlayerState } from "tws-common/player/tool/readState";
import { SimpleReduxPlayerState } from "tws-common/reduxplayer/simple";
import { onDurationChanged, onExternalSetIsPlayingWhenReady, onNewPlayerState, onPositionChanged } from "tws-common/reduxplayer/simple/actions";


type Element = HTMLAudioElement | HTMLMediaElement | HTMLVideoElement

/**
 * SimplePlayer, which uses HTMLAudioElement | HTMLMediaElement | HTMLVideoElement
 * in order to provide controls.
 */
export default class HTMLReduxPlayer<T> {
	private eventListeners: {
		event: string
		listener: any
	}[] = []

	private sourceCleanup: (() => void) | null = null
	private releaseReduxStore: (() => void) | null = null

	private currentSource: PlayerSource | null = null
	private sourceError: any | null = null

	private currentDuration: number | null = null
	private currentPosition: number | null = null
	private networkState: SimplePlayerNetworkState | null = null
	private readyState: SimplePlayerReadyState | null = null
	private isPlaying: boolean | null = null
	private isSeeking: boolean | null = null

	private lastSeekId: string | null = null

	private isPlayingWhenReady = false

	constructor(
		private readonly element: Element,
		private readonly store: Store<T>,
		private readonly selector: (storeState: T) => SimpleReduxPlayerState,
	) {
		this.hookToElement()
		const unsubscribe = store.subscribe(() => {
			const state = selector(store.getState())

			if (this.currentSource?.id !== state.config.source?.id) {
				this.setSource(state)
			}

			if (state.config.speed !== element.playbackRate) {
				element.playbackRate = state.config.speed
			}

			if (state.config.volume !== element.volume) {
				element.volume = state.config.volume
			}

			this.isPlayingWhenReady = state.config.isPlayingWhenReady

			if (this.currentSource !== null) {
				if (state.config.isPlayingWhenReady !== element.paused) {
					if (state.config.isPlayingWhenReady) {
						this.element.play().catch(e => {
							// noop here
							// ignore playing error, we will reset it when we want if needed
						})
					} else {
						this.element.pause()
					}
				}
			}

			if (
				state.config.seekData &&
				state.config.seekData.id !== this.lastSeekId
			) {
				this.lastSeekId = state.config.seekData.id
				this.seek(state.config.seekData.to)
			}
		})
		this.releaseReduxStore = () => unsubscribe()
	}

	private readAndEmitHTMLElementState = () => {
		if (this.releaseReduxStore === null) return // although it shouldn't, it may happen; exit then
		const playerState = readHTMLPlayerState(this.element)

		if (this.isPlayingWhenReady) {
			if (
				this.isPlayingWhenReady &&
				playerState.paused &&
				!playerState.error
			) {
				this.isPlayingWhenReady = false
				this.store.dispatch(onExternalSetIsPlayingWhenReady(false))
			}
			this.isPlayingWhenReady = false
		} else {
			if (
				!this.isPlayingWhenReady &&
				!playerState.paused &&
				!playerState.error &&
				playerState.isPlaying
			) {
				this.isPlayingWhenReady = true
				this.store.dispatch(onExternalSetIsPlayingWhenReady(true))
			}
		}

		if (
			playerState.error ||
			this.sourceError ||
			playerState.networkState !== this.networkState ||
			playerState.readyState !== this.readyState ||
			playerState.isPlaying !== this.isPlaying ||
			playerState.isSeeking !== this.isSeeking
		) {
			this.networkState = playerState.networkState
			this.readyState = playerState.readyState
			this.isSeeking = playerState.isSeeking
			this.isPlaying = playerState.isPlaying

			this.store.dispatch(
				onNewPlayerState({
					playerError: playerState.error,
					sourceError: this.sourceError,

					networkState: playerState.networkState,
					readyState: playerState.readyState,
					isPlaying: playerState.isPlaying,
					isSeeking: playerState.isSeeking,

					duration: playerState.duration,
					position: playerState.currentTime,
				}),
			)
		} else {
			if (this.currentPosition !== playerState.currentTime) {
				this.store.dispatch(onPositionChanged(playerState.currentTime))
			}

			if (this.currentDuration !== playerState.duration) {
				this.store.dispatch(onDurationChanged(playerState.duration))
			}
		}
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
		regListener("ended", () => handleStateChange())
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

	private syncIsPlayingWhenReady = () => {
		if (this.isPlayingWhenReady !== this.element.paused) {
			if (this.isPlayingWhenReady) {
				this.element.play().catch(e => {
					// noop here
					// ignore playing error, we will reset it when we want if needed
				})
			} else {
				this.element.pause()
			}
		}
	}

	private setSource = (state: SimpleReduxPlayerState) => {
		this.sourceError = null
		this.currentDuration = null
		this.currentPosition = null
		this.networkState = null
		this.readyState = null
		this.isSeeking = null
		this.isPlaying = null

		const prevSourceCleanup = this.sourceCleanup
		try {
			this.sourceCleanup = null

			const src = state.config.source
			this.currentSource = src
			if (src !== null) {
				// TODO(teawithsand): FIXME: this should be synchronized/locked, so only latest one gets executed
				// It's temporary quick'n'dirty fix
				;(async () => {
					let url: string
					let close: () => void
					try {
						;[url, close] =
							await DEFAULT_PLAYER_SOURCE_RESOLVER.obtainURL(src)
					} catch (e) {
						this.element.src = ""
						this.sourceError = e
						return
					}

					this.element.src = url
					this.sourceCleanup = close

					// load resets playback rate and volume(?)
					this.element.load()
					this.element.playbackRate = state.config.speed
					this.element.volume = state.config.volume

					this.syncIsPlayingWhenReady()
				})()
			} else {
				this.element.src = ""
			}
		} finally {
			if (prevSourceCleanup) prevSourceCleanup()
		}

		this.readAndEmitHTMLElementState()
	}

	private seek = (to: number) => {
		if (this.currentSource) {
			this.element.currentTime = to
			this.syncIsPlayingWhenReady()
		}
	}
}