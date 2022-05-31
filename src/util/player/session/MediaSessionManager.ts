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

export interface MediaSessionCallbacks {
	onPlay(): void
	onPause(): void
	onStop(): void
	onSeekBackward(): void
	onSeekForward(): void
	onSeekTo(): void
	onPreviousTrack(): void
	onNextTrack(): void
	onSkipAd(): void
}

export type MediaSessionPositionState = {
	duration?: number
	playbackRate?: number
	position?: number
}

export default class MediaSessionManager {
	private checkSupport = () =>
		window.navigator && window.navigator.mediaSession

	constructor(private callbacks: MediaSessionCallbacks) {
		if (this.checkSupport()) {
			window.navigator.mediaSession.setActionHandler("play", () =>
				this.callbacks.onPlay(),
			)
			window.navigator.mediaSession.setActionHandler("pause", () =>
				this.callbacks.onPause(),
			)
			window.navigator.mediaSession.setActionHandler("stop", () =>
				this.callbacks.onStop(),
			)
			window.navigator.mediaSession.setActionHandler("seekbackward", () =>
				this.callbacks.onSeekBackward(),
			)
			window.navigator.mediaSession.setActionHandler("seekforward", () =>
				this.callbacks.onSeekForward(),
			)

			window.navigator.mediaSession.setActionHandler("seekto", () =>
				this.callbacks.onSeekTo(),
			)
			window.navigator.mediaSession.setActionHandler(
				"previoustrack",
				() => this.callbacks.onPreviousTrack(),
			)
			window.navigator.mediaSession.setActionHandler("nexttrack", () =>
				this.callbacks.onNextTrack(),
			)
			window.navigator.mediaSession.setActionHandler("skipad", () =>
				this.callbacks.onSkipAd(),
			)
		}
	}

	setCallbacks = (callbacks: MediaSessionCallbacks) => {
		this.callbacks = callbacks
	}

	setMetadata = (metadata: MediaSessionMetadata) => {
		if (this.checkSupport())
			navigator.mediaSession.metadata = new MediaMetadata(metadata)
	}

	setPlaybackState = (state: "playing" | "paused" | "none") => {
		if (this.checkSupport()) navigator.mediaSession.playbackState = state
	}
}
