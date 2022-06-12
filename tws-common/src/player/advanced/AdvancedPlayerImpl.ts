import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import { DefaultStickyEventBus } from "tws-common/lang/bus/StickyEventBus"
import AdvancedPlayer, {
	Playlist,
} from "tws-common/player/advanced/AdvancedPlayer"
import AdvancedPlayerState from "tws-common/player/advanced/AdvancedPlayerState"
import SimplePlayer from "tws-common/player/simple/SimplePlayer"
import SimplePlayerNetworkState from "tws-common/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState from "tws-common/player/simple/SimplePlayerReadyState"
import SimplePlayerState from "tws-common/player/simple/SimplePlayerState"

// TODO(teawithsand): detect inconsistency between metadata duration and player duration
//  since for now it's assumed to be exact same value
//  which may cause bugs

// TODO(teawithsand): integrate media session event handling into this player
//  even though in modern browsers play/pause is handled already

export default class AdvancedPlayerImpl implements AdvancedPlayer {
	private isClosed = false

	private rate = 4
	private volume = 1
	private isPlayingWhenReady = false

	private ended = false

	constructor(private readonly innerPlayer: SimplePlayer) {
		this.setIsPlayingWhenReady(this.isPlayingWhenReady)
		this.setRate(this.rate)
		this.setVolume(this.volume)

		innerPlayer.eventBus.addSubscriber(state => this.onStateChange(state))

		this.setInnerPlayerSource()
	}

	private readonly innerEventBus =
		new DefaultStickyEventBus<AdvancedPlayerState>({
			type: "no-source",
		})

	get eventBus(): StickySubscribable<AdvancedPlayerState> {
		return this.innerEventBus
	}

	private innerPlaylist: Playlist = []
	private currentSourceIndex = 0

	get playlist(): Playlist {
		return [...this.innerPlaylist]
	}

	setIsPlayingWhenReady = (isPlayingWhenReady: boolean): void => {
		this.isPlayingWhenReady = isPlayingWhenReady
		this.innerPlayer.setIsPlayingWhenReady(isPlayingWhenReady)
	}

	setRate = (rate: number): void => {
		this.rate = rate
		this.innerPlayer.setRate(rate)
	}

	setVolume = (volume: number): void => {
		this.volume = volume
		this.innerPlayer.setVolume(volume)
	}

	reload = (): void => {
		this.setInnerPlayerSource()
	}

	setPlaylist = (playlist: Playlist): void => {
		playlist = [...playlist]
		try {
			if (playlist.length === 0) {
				this.setInnerPlayerSource()
				this.goToEndedState()
				return
			}

			if (this.currentSourceIndex >= playlist.length) {
				this.currentSourceIndex = playlist.length - 1
				this.goToEndedState()
				return
			}
		} finally {
			this.innerPlaylist = playlist
		}

		this.setInnerPlayerSource()
	}

	localSeek = (to: number): void => {
		this.ended = false
		this.innerPlayer.seek(to)
		this.emitState()
	}

	seek = (index: number, to: number): void => {
		if (index > this.playlist.length) {
			this.goToEndedState()
			return
		}
		if (this.currentSourceIndex !== index) {
			this.currentSourceIndex = index
			this.setInnerPlayerSource()
		}

		// done by localSeek
		// this.ended = false
		this.localSeek(to)
		// this.emitState()
	}

	private onStateChange = (state: SimplePlayerState) => {
		if (state.type === "closed") {
			this.isClosed = true
		} else if (state.type === "no-source") {
			// ignore this once, source is managed by outer player
		} else if (state.type === "error") {
			// it's noop, it will be read by emitState
		} else if (state.type === "running") {
			const { ended, isPlayingWhenReady } = state

			this.isPlayingWhenReady = isPlayingWhenReady

			if (ended) {
				this.onInnerPlaybackEndedNoEmit()
			}
		}

		this.emitState()
	}

	private onInnerPlaybackEndedNoEmit = () => {
		if (this.currentSourceIndex < this.playlist.length) {
			this.currentSourceIndex += 1
			this.setInnerPlayerSource()
		} else {
			this.ended = true
		}
	}

	private goToEndedState = () => {
		this.ended = true

		this.emitState()
	}

	/**
	 * Commits:
	 * - playlist
	 * - currentIndex
	 *
	 * To underlying instance of simple player.
	 */
	private setInnerPlayerSource = () => {
		if (this.currentSourceIndex < this.playlist.length) {
			this.innerPlayer.setSource(this.playlist[this.currentSourceIndex])
		} else {
			this.innerPlayer.setSource(null)
		}
	}

	private makeState = (): AdvancedPlayerState => {
		const innerPlayerState = this.innerPlayer.eventBus.lastEvent
		if (this.isClosed || innerPlayerState.type === "closed") {
			return {
				type: "closed",
			}
		} else if (
			this.innerPlaylist.length === 0 ||
			innerPlayerState.type === "no-source"
		) {
			return {
				type: "no-source",
			}
		} else if (innerPlayerState.type === "error") {
			return {
				type: "running",
				currentSourceIndex: this.currentSourceIndex,

				rate: this.rate,
				volume: this.volume,
				isPlayingWhenReady: this.isPlayingWhenReady,
				ended: this.ended,
				error: innerPlayerState.error,

				isPlaying: false,
				localCurrentTime: null,
				localDuration: null,
				networkState: SimplePlayerNetworkState.EMPTY,
				readyState: SimplePlayerReadyState.NOTHING,
				playlist: this.playlist,
				seeking: false,
			}
		} else if (innerPlayerState.type === "running") {
			return {
				type: "running",
				currentSourceIndex: this.currentSourceIndex,

				rate: this.rate,
				volume: this.volume,
				isPlayingWhenReady: this.isPlayingWhenReady,
				ended: this.ended,
				error: null,
				isPlaying: innerPlayerState.isPlaying,
				localCurrentTime: innerPlayerState.currentTime,
				localDuration: innerPlayerState.duration,
				networkState: innerPlayerState.networkState,
				readyState: innerPlayerState.readyState,
				seeking: innerPlayerState.seeking,
				playlist: this.playlist,
			}
		} else {
			throw new Error("unreachable code")
		}
	}

	private emitState = () => {
		this.innerEventBus.emitEvent(this.makeState())
	}
}
