import SimplePlayerEvent from "@app/components/player/simple/SimplePlayerEvent";
import { Subscribable } from "@app/util/lang/bus/stateSubscribe";


export default interface SimplePlayer {
	eventBus: Subscribable<SimplePlayerEvent>

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