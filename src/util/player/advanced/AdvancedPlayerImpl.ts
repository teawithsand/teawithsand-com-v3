import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"
import { DefaultStickyEventBus } from "@app/util/lang/bus/StickyEventBus"
import AdvancedPlayer, {
	Playlist,
} from "@app/util/player/advanced/AdvancedPlayer"
import AdvancedPlayerState from "@app/util/player/advanced/AdvancedPlayerState"
import APMetadataLoaderTaskHelper from "@app/util/player/advanced/APMetadataLoaderTaskHelper"
import SimplePlayer from "@app/util/player/simple/SimplePlayer"
import SimplePlayerNetworkState from "@app/util/player/simple/SimplePlayerNetworkState"
import SimplePlayerReadyState from "@app/util/player/simple/SimplePlayerReadyState"
import SimplePlayerState from "@app/util/player/simple/SimplePlayerState"

// TODO(teawithsand): detect inconsistency between metadata duration and player duration
//  since for now it's assumed to be exact same value
//  which may cause bugs

export default class AdvancedPlayerImpl implements AdvancedPlayer {
	private isClosed = false
	private metadataHelper = new APMetadataLoaderTaskHelper()

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

		this.metadataHelper.metadataBagBus.addSubscriber(() => {
			this.emitState()
		})
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
			this.metadataHelper.setPlaylist(playlist)
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

	globalSeek = (to: number): boolean => {
		const metadataBag = this.metadataHelper.metadataBagBus.lastEvent

		const index = metadataBag.getIndexFromPosition(to)
		if (index === null) return false
		const durationToFile = metadataBag.getDurationToIndex(index)
		if (durationToFile === null) return false

		// done by seek
		// this.ended = false
		this.seek(index, Math.max(to - durationToFile, 0))
		// this.emitState()
		return true
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
				metadata: this.metadataHelper.metadataBagBus.lastEvent,

				rate: this.rate,
				volume: this.volume,
				isPlayingWhenReady: this.isPlayingWhenReady,
				ended: this.ended,
				error: innerPlayerState.error,

				globalCurrentPosition: null,
				isPlaying: false,
				localCurrentTime: null,
				localDuration: null,
				networkState: SimplePlayerNetworkState.EMPTY,
				readyState: SimplePlayerReadyState.NOTHING,
				playlist: this.playlist,
				seeking: false,
			}
		} else if (innerPlayerState.type === "running") {
			const durationToIndex =
				this.metadataHelper.metadataBagBus.lastEvent.getDurationToIndex(
					this.currentSourceIndex,
				)
			const currentTime = innerPlayerState.currentTime

			const globalCurrentPosition =
				durationToIndex !== null && currentTime !== null
					? durationToIndex + currentTime
					: null
			return {
				type: "running",
				currentSourceIndex: this.currentSourceIndex,
				metadata: this.metadataHelper.metadataBagBus.lastEvent,

				rate: this.rate,
				volume: this.volume,
				isPlayingWhenReady: this.isPlayingWhenReady,
				ended: this.ended,
				error: null,
				globalCurrentPosition,
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
