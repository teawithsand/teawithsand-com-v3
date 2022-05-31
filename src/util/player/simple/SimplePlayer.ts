import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"
import SimplePlayerState from "@app/util/player/simple/SimplePlayerState"

/**
 * An abstraction over something, which is able to play single file, either audio or video.
 */
export default interface SimplePlayer {
	eventBus: StickySubscribable<SimplePlayerState>

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
	setSource(src: string): void

	/**
	 * Seeks player to specified position in seconds.
	 * On out-of-range seek to the end causes ended to trigger immediately.
	 * Seek during ended state causes ended state to disappear.
	 *
	 * @argument to Must be finite number >= 0
	 */
	seek(to: number): void
}
