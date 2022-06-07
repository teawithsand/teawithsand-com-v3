import { StickySubscribable } from "tws-common/lang/bus/stateSubscribe"
import SimplePlayerState from "tws-common/player/simple/SimplePlayerState"
import PlayerSource from "tws-common/player/source/PlayerSource"

/**
 * An abstraction over something, which is able to play single file, either audio or video.
 */
export default interface SimplePlayer {
	readonly eventBus: StickySubscribable<SimplePlayerState>

	setIsPlayingWhenReady(isPlayingWhenReady: boolean): void
	/**
	 * Sets playback speed. Must be positive and finite number.
	 */
	setRate(rate: number): void
	/**
	 * Sets volume.
	 * Must be number between 0 and 1.
	 */
	setVolume(volume: number): void

	/**
	 * Releases all player's resources.
	 */
	release(): void

	/**
	 * Resets any state, which may have been set(like errors) and sets specified source.
	 * Works also if source is equal to one currently set.
	 */
	setSource(src: PlayerSource | null): void

	/**
	 * Seeks player to specified position in seconds.
	 * On out-of-range seek to the end causes ended to trigger immediately.
	 * Seek during ended state causes ended state to disappear.
	 *
	 * @argument to Must be finite number >= 0
	 */
	seek(to: number): void
}
