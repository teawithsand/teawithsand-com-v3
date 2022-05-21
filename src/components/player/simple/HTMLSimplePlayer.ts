import SimplePlayer from "@app/components/player/simple/SimplePlayer"
import SimplePlayerEvent from "@app/components/player/simple/SimplePlayerEvent"
import { simplePlayerNetworkStateFromNative } from "@app/components/player/simple/SimplePlayerNetworkState"
import { simplePlayerReadyStateFromNative } from "@app/components/player/simple/SimplePlayerReadyState"
import { SimpleEventBus } from "@app/util/lang/bus/EventBus"
import { Subscribable } from "@app/util/lang/bus/stateSubscribe"
import { readHTMLPlayerState } from "@app/util/player/readState"

type Element = HTMLAudioElement | HTMLMediaElement | HTMLVideoElement

const sanitizeTime = (t: number): number | null =>
	isFinite(t) && t >= 0 ? t : null

export default class HTMLSimplePlayer implements SimplePlayer {
	private innerEventBus = new SimpleEventBus<SimplePlayerEvent>()

	get eventBus(): Subscribable<SimplePlayerEvent> {
		return this.innerEventBus
	}

	private eventListeners: {
		event: string
		listener: any
	}[] = []

	private isPlayingWhenReady = false
	// protected error: MediaError | null = null
	// private rate = 1
	private source = ""

	private isClosed = false

	constructor(private readonly element: Element) {
		this.hookToElement(element)
	}

	private hookToElement = (element: Element) => {
		const regListener = (event: string, listener: (e: Event) => void) => {
			const actualListener = (e: Event) => {
				const data = readHTMLPlayerState(element)
				console.log("Got event", {
					name: event,
					data: e,
					...data,
				})
				listener(e)
			}

			element.addEventListener(event, actualListener)
			this.eventListeners.push({
				listener: actualListener,
				event,
			})
		}

		const handleStateChange = () => {
			const networkState = simplePlayerNetworkStateFromNative(
				element.networkState,
			)
			const readyState = simplePlayerReadyStateFromNative(
				element.readyState,
			)

			this.innerEventBus.emitEvent({
				type: "stateChange",
				networkState,
				readyState,
				seeking: element.seeking,
			})
		}

		regListener("error", () => {
			const error = element.error
			if (error) {
				this.innerEventBus.emitEvent({
					type: "error",
					error,
				})
			}
		})

		regListener("timeupdate", () => {
			const position = sanitizeTime(element.currentTime)
			if (position) {
				this.innerEventBus.emitEvent({
					type: "positionChanged",
					position,
				})
			}
		})

		regListener("durationchange", () => {
			const duration = sanitizeTime(element.duration)
			if (duration) {
				this.innerEventBus.emitEvent({
					type: "durationChanged",
					duration,
				})
			}
		})

		regListener("ended", () => {
			this.innerEventBus.emitEvent({
				type: "ended",
			})
		})

		regListener("seeking", () => handleStateChange())
		regListener("seeked", () => handleStateChange())
		regListener("progress", () => handleStateChange())
		regListener("canplay", () => handleStateChange())
		regListener("canplaythrough", () => handleStateChange())
		regListener("waiting", () => handleStateChange())

		regListener("pause", () => {
			if (this.source !== "" && this.isPlayingWhenReady) {
				this.innerEventBus.emitEvent({
					type: "isPlayingWhenReadyChanged",
					isPlayingWhenReady: false,
				})
			}
		})

		regListener("play", () => {
			if (this.source !== "" && !this.isPlayingWhenReady) {
				this.innerEventBus.emitEvent({
					type: "isPlayingWhenReadyChanged",
					isPlayingWhenReady: true,
				})
			}
		})
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

		if (this.source !== "") {
			if (isPlayingWhenReady) {
				this.element.play()
			} else {
				this.element.pause()
			}
		}
	}

	setRate = (rate: number) => {
		this.element.playbackRate = rate
	}

	setSource = (src: string) => {
		if (this.isClosed) throw new Error("is closed")

		this.innerEventBus.emitEvent({
			type: "load",
		})

		this.source = src
		this.element.src = src
		this.element.load()

		if (this.isPlayingWhenReady) {
			this.element.play()
		} else {
			this.element.pause()
		}
	}

	seek = (to: number) => {
		if (this.source !== "") {
			this.element.currentTime = to
		}
	}
}
