import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe";
import { DefaultStickyEventBus } from "@app/util/lang/bus/StickyEventBus";
import SimplePlayer from "@app/util/player/simple/SimplePlayer";
import SimplePlayerNetworkState from "@app/util/player/simple/SimplePlayerNetworkState";
import SimplePlayerReadyState from "@app/util/player/simple/SimplePlayerReadyState";
import SimplePlayerState from "@app/util/player/simple/SimplePlayerState";
import { HTMLPlayerState, readHTMLPlayerState } from "@app/util/player/tool/readState";


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
	private source = ""

	private isClosed = false

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

	private hookToElement = (element: Element) => {
		const regListener = (event: string, listener: (e: Event) => void) => {
			const actualListener = (e: Event) => {
				// const data = readHTMLPlayerState(element)
				// console.log("Got event", {
				// 	name: event,
				// 	data: e,
				// 	...data,
				// })
				listener(e)
			}

			element.addEventListener(event, actualListener)
			this.eventListeners.push({
				listener: actualListener,
				event,
			})
		}

		const handleStateChange = () => {
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

		regListener("error", () => handleStateChange())
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
			this.element.play()
		} else {
			this.element.pause()
		}
	}

	release = () => {
		if (!this.isClosed) {
			this.element.pause()
			this.element.src = ""

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
		this.element.playbackRate = rate
	}

	setVolume = (volume: number) => {
		this.element.volume = volume
	}

	setSource = (src: string) => {
		if (this.isClosed) throw new Error("is closed")

		this.source = src
		this.element.src = src
		this.element.load()

		this.syncIsPlayingWhenReady()

		this.emitState()
	}

	seek = (to: number) => {
		if (this.source) {
			this.element.currentTime = to
			this.syncIsPlayingWhenReady()
		}
	}
}