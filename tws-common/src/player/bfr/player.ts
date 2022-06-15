import { Store } from "redux"
import { DefaultTaskAtom } from "tws-common/lang/task/TaskAtom"
import {
	onExternalSetIsPlayingWhenReady,
	onNewPlayerState,
	onSourcePlaybackEnded,
} from "tws-common/player/bfr/actions"
import { BFRState } from "tws-common/player/bfr/state"
import PlayerSource from "tws-common/player/source/PlayerSource"
import { DEFAULT_PLAYER_SOURCE_RESOLVER } from "tws-common/player/source/PlayerSourceResolver"
import { readHTMLPlayerState } from "tws-common/player/tool/readState"
import { SyncID } from "tws-common/redux/sync/id"

type Element = HTMLAudioElement | HTMLMediaElement | HTMLVideoElement

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

	private currentPlaylistId: SyncID | null = null
	private currentPlaylist: PlayerSource[] = []
	private currentEntryIndex = 0

	private sourceError: any | null = null
	private lastSeekId: SyncID | null = null

	private readonly taskAtom = new DefaultTaskAtom()

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

		console.log("playerState", playerState)

		// if we can use get state
		// just do that
		// even though its hack
		const state = this.selector(this.store.getState())
		if (state.playerConfig.isPlayingWhenReady) {
			if (playerState.paused && !playerState.error) {
				this.store.dispatch(onExternalSetIsPlayingWhenReady(false))
			}
		} else {
			if (
				!playerState.paused &&
				!playerState.error &&
				playerState.isPlaying
			) {
				this.store.dispatch(onExternalSetIsPlayingWhenReady(true))
			}
		}

		if (playerState.isEnded) {
			this.store.dispatch(onSourcePlaybackEnded())
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
		if (state.playerConfig.isPlayingWhenReady) {
			this.element.play().catch(() => {
				// noop here
				// ignore playing error, we will reset it when we want if needed
			})
		} else {
			this.element.pause()
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

			try {
				this.sourceCleanup = null

				if (src !== null) {
					// TODO(teawithsand): FIXME: this should be synchronized/locked, so only latest one gets executed
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
							console.error("Resolving source error", e)
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
					})()
				} else {
					if (this.element.src !== "") {
						this.element.src = ""
						this.readAndEmitHTMLElementState()
					}
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
