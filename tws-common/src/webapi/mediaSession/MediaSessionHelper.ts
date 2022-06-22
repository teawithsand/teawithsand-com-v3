import { SimpleEventBus } from "tws-common/lang/bus/EventBus"
import { Subscribable } from "tws-common/lang/bus/stateSubscribe"
import { objectEquals } from "tws-common/lang/equal"

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

export type MediaSessionPositionState = {
	duration: number | null // if null then inf stream
	position: number // may not be greater than duration, if it's not null
	playbackRate: number // must be > 0
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

// Docs:
// https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler
// https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setPositionState

export type MediaSessionActionType =
	| "play"
	| "pause"
	| "stop"
	| "seekbackward"
	| "seekforward"
	| "seekto"
	| "previoustrack"
	| "nexttrack"
	| "skipad"

export const allMediaSessionActions: MediaSessionActionType[] = [
	"play",
	"pause",
	"stop",
	"seekbackward",
	"seekforward",
	"seekto",
	"previoustrack",
	"nexttrack",
	"skipad",
]

const tuplesToMap = <T, E>(iterable: Iterable<[T, E]>): Map<T, E> => {
	const m = new Map()
	for (const [k, v] of iterable) m.set(k, v)
	return m
}

class MediaSessionHelperImpl {
	private checkSupport = () =>
		window && window.navigator && window.navigator.mediaSession

	private innerEventBus = new SimpleEventBus<MediaSessionEvent>()

	get eventBus(): Subscribable<MediaSessionEvent> {
		return this.innerEventBus
	}

	public readonly isSupported = this.checkSupport()

	private supportedActions: Set<MediaSessionActionType> = new Set()

	private lastSetMediaSessionMetadata: MediaSessionMetadata | null = null
	private lastSetMediaPositionState: MediaSessionPositionState | null = null

	private readonly actionHandlers: Map<
		MediaSessionActionType,
		(e: any) => void
	> = tuplesToMap([
		[
			"play",
			() =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.PLAY,
				}),
		],
		[
			"pause",
			() =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.PAUSE,
				}),
		],

		[
			"stop",
			() =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.STOP,
				}),
		],
		[
			"seekbackward",
			(details: any) =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.SEEK_BACKWARD,
					by: details.seekOffset ?? null,
				}),
		],
		[
			"seekforward",
			(details: any) =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.SEEK_FORWARD,
					by: details.seekOffset ?? null,
				}),
		],
		[
			"seekto",
			(details: any) =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.SEEK_TO,
					to: details.seekTime ?? null,
					fastSeek: details.fastSeek ?? null,
				}),
		],
		[
			"previoustrack",
			() =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.PREVIOUS_TRACK,
				}),
		],
		[
			"nexttrack",
			() =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.NEXT_TRACK,
				}),
		],
		[
			"skipad",
			() =>
				this.innerEventBus.emitEvent({
					type: MediaSessionEventType.SKIP_AD,
				}),
		],
	])

	constructor() {
		this.setSupportedActions(allMediaSessionActions)
	}

	setSupportedActions = (
		actions:
			| MediaSessionActionType[]
			| Iterable<MediaSessionActionType>
			| Set<MediaSessionActionType>,
	) => {
		// make a copy + cast if needed
		const castedActions = new Set(actions)

		const removedActions = [...this.supportedActions.values()].filter(
			v => !castedActions.has(v),
		)

		const addedActions = [...castedActions.values()].filter(
			v => !this.supportedActions.has(v),
		)

		if (this.checkSupport()) {
			for (const a of removedActions) {
				navigator.mediaSession.setActionHandler(a, null)
			}

			for (const a of addedActions) {
				const h = this.actionHandlers.get(a)
				if (!h)
					throw new Error(
						`Unreachable code - no handler for action ${a}`,
					)
				navigator.mediaSession.setActionHandler(a, h)
			}
		}

		this.supportedActions = castedActions
	}

	setMetadata = (metadata: MediaSessionMetadata | null) => {
		if (this.checkSupport()) {
			if (!objectEquals(metadata, this.lastSetMediaSessionMetadata)) {
				navigator.mediaSession.metadata = metadata
					? new MediaMetadata(metadata)
					: null
				if (metadata) {
					this.lastSetMediaSessionMetadata = {
						...metadata,
						artwork: [...metadata.artwork],
					}
				} else {
					this.lastSetMediaSessionMetadata = null
				}
			}
		}
	}

	setPlaybackState = (state: "playing" | "paused" | "none") => {
		if (this.checkSupport()) navigator.mediaSession.playbackState = state
	}

	setPositionState = (state: MediaSessionPositionState) => {
		if (this.checkSupport() && navigator.mediaSession.setPositionState) {
			if (!objectEquals(this.lastSetMediaPositionState, state)) {
				this.lastSetMediaPositionState = { ...state }

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
}

export const MediaSessionHelper = new MediaSessionHelperImpl()
