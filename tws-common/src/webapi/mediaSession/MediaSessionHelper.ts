import { SimpleEventBus } from "tws-common/lang/bus/EventBus";
import { Subscribable } from "tws-common/lang/bus/stateSubscribe";


export type MediaSessionMetadata = {
	title: string
	artist: string
	album: string
	artwork: {
		src: string
		sizes: string
		type: string
	}[]
}

export enum MediaSessionEventType {
	PLAY = 1,
	PAUSE = 2,
	STOP = 3,
	SEEK_BACKWARD = 4,
	SEEK_FORWARD = 5,
	SEEK_TO = 6,
	PREVIOUS_TRACK = 7,
	NEXT_TRACK = 8,
	SKIP_AD = 9,
}

export type PositionState = {
	duration: number | null // if null then inf stream
	position: number // may not be greater than duration, if it's not null
	playbackRate: number // must be > 0
}

export type MediaSessionEvent =
	| {
			type: MediaSessionEventType.PLAY
	  }
	| {
			type: MediaSessionEventType.PAUSE
	  }
	| {
			type: MediaSessionEventType.STOP
	  }
	| {
			type: MediaSessionEventType.SEEK_BACKWARD
			by: number | null
	  }
	| {
			type: MediaSessionEventType.SEEK_FORWARD
			by: number | null
	  }
	| {
			type: MediaSessionEventType.SEEK_TO
			to: number | null
			fastSeek: boolean | null
	  }
	| {
			type: MediaSessionEventType.PREVIOUS_TRACK
	  }
	| {
			type: MediaSessionEventType.NEXT_TRACK
	  }
	| {
			type: MediaSessionEventType.SKIP_AD
	  }

export type MediaSessionPositionState = {
	duration?: number
	playbackRate?: number
	position?: number
}
// Docs:
// https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler
// https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState

class MediaSessionHelperImpl {
	private checkSupport = () =>
		window.navigator && window.navigator.mediaSession

	private innerEventBus = new SimpleEventBus<MediaSessionEvent>()

	get eventBus(): Subscribable<MediaSessionEvent> {
		return this.innerEventBus
	}

	public readonly isSupported = this.checkSupport()

	constructor() {
		if (this.checkSupport()) {
			window.navigator.mediaSession.setActionHandler("play", () =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.PLAY,
				}),
			)
			window.navigator.mediaSession.setActionHandler("pause", () =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.PAUSE,
				}),
			)
			window.navigator.mediaSession.setActionHandler("stop", () =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.STOP,
				}),
			)
			window.navigator.mediaSession.setActionHandler(
				"seekbackward",
				details =>
					this.innerEventBus.emitEvent({
						type: MediaSessionEventType.SEEK_BACKWARD,
						by: details.seekOffset ?? null,
					}),
			)
			window.navigator.mediaSession.setActionHandler(
				"seekforward",
				details =>
					this.innerEventBus.emitEvent({
						type: MediaSessionEventType.SEEK_FORWARD,
						by: details.seekOffset ?? null,
					}),
			)

			window.navigator.mediaSession.setActionHandler("seekto", details =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.SEEK_TO,
					to: details.seekTime ?? null,
					fastSeek: details.fastSeek ?? null,
				}),
			)
			window.navigator.mediaSession.setActionHandler(
				"previoustrack",
				() =>
					this.innerEventBus.emitEvent({
						type: MediaSessionEventType.PREVIOUS_TRACK,
					}),
			)
			window.navigator.mediaSession.setActionHandler("nexttrack", () =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.NEXT_TRACK,
				}),
			)
			/*
			window.navigator.mediaSession.setActionHandler("skipad", () =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.SKIP_AD,
				}),
			)
			*/
		}
	}

	setMetadata = (metadata: MediaSessionMetadata) => {
		if (this.checkSupport())
			navigator.mediaSession.metadata = new MediaMetadata(metadata)
	}

	setPlaybackState = (state: "playing" | "paused" | "none") => {
		if (this.checkSupport()) navigator.mediaSession.playbackState = state
	}

	setPositionState = (state: PositionState) => {
		if (this.checkSupport()) {
			let duration = state.duration ?? Infinity
			if (duration < 0) duration = 0

			let position = state.position
			if (!isFinite(position) || position < 0) position = 0

			position = Math.min(position, duration)

			if (state.playbackRate === 0)
				throw new Error(
					"Playback rate may not be zero, it has to be positive or negative integer(neg if playing backwards)",
				)

			navigator.mediaSession.setPositionState({
				playbackRate: state.playbackRate,
				duration,
				position,
			})
		}
	}
}

export const MediaSessionHelper = new MediaSessionHelperImpl()