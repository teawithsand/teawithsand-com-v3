import SimplePlayerState from "@app/components/player/simple/SimplePlayerState"
import { StickySubscribable } from "@app/util/lang/bus/stateSubscribe"

export default interface SimplePlayer {
	eventBus: StickySubscribable<SimplePlayerState>

	setIsPlayingWhenReady(isPlayingWhenReady: boolean): void
	setRate(rate: number): void

	/**
	 * Releases all player's resources.
	 */
	release(): void

	/**
	 * Resets any state, which may have been set(like errors) and sets specified source.
	 * Works also if source is equal to one currently set.
	 */
	setSource(src: string): void

	seek(to: number): void
}
