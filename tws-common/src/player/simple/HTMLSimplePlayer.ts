import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe";
import { DefaultStickyEventBus } from "tws-common/lang/bus/StickyEventBus";
import SimplePlayer from "tws-common/player/simple/SimplePlayer";
import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState";
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState";
import SimplePlayerState from "tws-common/player/simple/SimplePlayerState";
import PlayerSource, { obtainPlayerSourceURL } from "tws-common/player/source/PlayerSource";
import { HTMLPlayerState, readHTMLPlayerState } from "tws-common/player/tool/readState";


type Element = HTMLAudioElement | HTMLMediaElement | HTMLVideoElement

/**
 * SimplePlayer, which uses HTMLAudioElement | HTMLMediaElement | HTMLVideoElement
 * in order to provide controls.
 */
export default class HTMLSimplePlayer implements SimplePlayer {
	private innerEventBus = new DefaultStickyEventBus<SimplePlayerState>({
		type: "no-source",
	})

	get eventBus(): StickySubscribable<SimplePlayerState> {
		return this.innerEventBus
	}

	private eventListeners: {
		event: string
		listener: any
	}[] = []

	private isPlayingWhenReady = false
	protected error: MediaError | null = null
	// private rate = 1
	private source: PlayerSource | null = null
	private sourceCleanup: (() => void) | null = null

	private isClosed = false

	private rate = 1
	private volume = 1

	constructor(private readonly element: Element) {
		this.hookToElement(element)
	}

	private lastState: HTMLPlayerState | null = null

	private makeState = (): SimplePlayerState => {
		if (this.isClosed) {
			return { type: "closed" }
		}
		if (!this.source) {
			return { type: "no-source" }
		}
		if (this.error) {
			return { type: "error", error: this.error }
		}
		if (!this.lastState) {
			return {
				type: "running",
				source: this.source,
				currentTime: 0,
				duration: 0,
				ended: false,
				isPlaying: false,
				networkState: SimplePlayerNetworkState.EMPTY,
				readyState: SimplePlayerReadyState.NOTHING,
				seeking: false,
				isPlayingWhenReady: this.isPlayingWhenReady,
			}
		}

		return {
			type: "running",
			source: this.source,
			...this.lastState,

			// if we pause it will take effect in next tick, but for sake of simplicity
			// emulate pause having effect right now
			isPlaying: this.isPlayingWhenReady && this.lastState.isPlaying,
			isPlayingWhenReady: this.isPlayingWhenReady,
		}
	}

	private emitState = () => {
		this.innerEventBus.emitEvent(this.makeState())
	}

	private readAndEmitHTMLElementState = (element?: Element) => {
		element = element ?? this.element

		if (this.isClosed) return // although it shouldn't, it may happen; exit then
		const data = readHTMLPlayerState(element)

		if (data.error) {
			this.error = data.error
			this.element.pause() // make sure we won't play after error. It may happen if data was buffered already.
		} else {
			// Allows remote controls to control audio element
			// we from code here may not be the only, who change pause
			if (!data.ended && data.paused) {
				this.isPlayingWhenReady = false
			} else if (!data.paused) {
				this.isPlayingWhenReady = true
			}
		}

		this.lastState = data
		this.emitState()
	}

	private hookToElement = (element: Element) => {
		const regListener = (event: string, listener: (e: Event) => void) => {
			const actualListener = (e: Event) => {
				listener(e)
			}

			element.addEventListener(event, actualListener)
			this.eventListeners.push({
				listener: actualListener,
				event,
			})
		}

		const handleStateChange = () =>
			this.readAndEmitHTMLElementState(element)

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

	private syncIsPlayingWhenReady = () => {
		if (this.isPlayingWhenReady) {
			this.element.play().catch(e => {
				// noop here
			})
		} else {
			this.element.pause()
		}
	}

	release = () => {
		if (!this.isClosed) {
			this.element.pause()
			this.element.src = ""

			if (this.sourceCleanup) {
				this.sourceCleanup()
				this.sourceCleanup = null
			}

			this.eventListeners.forEach(e => {
				this.element.removeEventListener(e.event, e.listener)
			})
		}
		this.isClosed = true
	}

	setIsPlayingWhenReady = (isPlayingWhenReady: boolean) => {
		this.isPlayingWhenReady = isPlayingWhenReady

		if (this.source) {
			this.syncIsPlayingWhenReady()
		}
	}

	setRate = (rate: number) => {
		this.rate = rate
		this.element.playbackRate = rate
	}

	setVolume = (volume: number) => {
		this.volume = volume
		this.element.volume = volume
	}

	setSource = (src: PlayerSource | null) => {
		if (this.isClosed) throw new Error("is closed")

		const oldCleanup = this.sourceCleanup
		try {
			this.sourceCleanup = null

			this.source = src
			if (src !== null) {
				// TODO(teawithsand): FIXME: this should be synchronized/locked, so only latest one gets executed
				// It's temporary quick'n'dirty fix
				(async () => {
					const [url, close] = await obtainPlayerSourceURL(src)
					this.element.src = url
					this.sourceCleanup = close

					// load resets playback rate and volume(?)
					this.element.load()
					this.element.playbackRate = this.rate
					this.element.volume = this.volume

					this.syncIsPlayingWhenReady()
				})()
			} else {
				this.element.src = ""
			}
		} finally {
			if (oldCleanup) oldCleanup()
		}

		this.readAndEmitHTMLElementState(this.element)
	}

	seek = (to: number) => {
		if (this.source) {
			this.element.currentTime = to
			this.syncIsPlayingWhenReady()
		}
	}
}